importScripts('food.min.js');

onmessage = function (e) {
    calculateMenu(e.data);
}

function calculateMenu(data) {

    var ingredients = data.ingredients;
    var recipes = filterRecipes(data.recipes, data.ingredients);
    var chefs = data.chefs;
    var mode = data.mode;

    var totalCount = chefs.length;
    var currentProgress = 0;

    var menusData = new Array();

    for (var i in chefs) {

        if (mode == "all") {
            var progress = Math.floor((Math.floor(i) + 1) * 100 / totalCount);
            if (progress > currentProgress) {
                currentProgress = progress;
                postMessage({ "progress": { "value": progress, "display": Math.floor(i) + 1 + " / " + totalCount } });
            }
        }

        var recipesData = new Array();

        for (var j in recipes) {
            var qualityData = getQualityInfo(recipes[j], chefs[i]);
            if (qualityData.qualityVal == 0) {
                continue;
            }

            var quantity = 1;
            if (data.recipesMulitple) {
                quantity = recipes[j].total;
            }
            var skillAddition = getChefSkillAddition(recipes[j], chefs[i], ingredients);
            var otherAddition = 0;
            if (data.hasRecipesAddition) {
                otherAddition += Math.floor(recipes[j].addition);
            }
            if (data.hasChefsAddition) {
                otherAddition += Math.floor(chefs[i].addition);
            }
            if (data.hasIngredientsAddition) {
                var ingredientsAddition = getIngredientsAddition(recipes[j], ingredients, data.ingredientsAdditionCumulative);
                otherAddition += ingredientsAddition;
            }

            var recipeData = new Object();

            recipeData["data"] = recipes[j];
            recipeData["qualityVal"] = qualityData.qualityVal;
            recipeData["qualityDisp"] = qualityData.qualityDisp;
            recipeData["qualityAddition"] = qualityData.qualityAddition;
            recipeData["qualityAdditionDisp"] = qualityData.qualityAddition || "";
            recipeData["skillAddition"] = skillAddition;
            recipeData["skillAdditionDisp"] = skillAddition || "";
            recipeData["otherAddition"] = otherAddition;
            recipeData["otherAdditionDisp"] = otherAddition || "";
            recipeData["quantity"] = quantity;
            recipeData["totalPrice"] = recipes[j].price * quantity;
            recipeData["realTotalPrice"] = Math.ceil(recipes[j].price * (1 + qualityData.qualityAddition + skillAddition)) * quantity;
            recipeData["bonusScore"] = Math.ceil(recipes[j].price * otherAddition) * quantity;
            recipeData["totalScore"] = recipeData.realTotalPrice + recipeData.bonusScore;

            recipesData.push(recipeData);
        }

        recipesData.sort(function (a, b) {
            return b.totalScore - a.totalScore
        });

        var limit = 9;
        if (mode == "all") {
            limit = data.limit;
        }

        var maxSize = Math.min(limit, recipesData.length);
        recipesData = recipesData.slice(0, maxSize);

        var menuData = new Object();
        menuData["chef"] = chefs[i];
        menuData["recipes"] = recipesData;

        if (mode == "optimal") {
            menuData["min3sum"] = getMin3Sum(recipesData);
            menuData["max3sum"] = getMax3Sum(recipesData);
        }


        menusData.push(menuData);
    }

    if (mode == "optimal") {

        if (menusData.length > 3) {
            menusData.sort(function (a, b) {
                return b.min3sum - a.min3sum
            });

            var max3limit = getMin3Limit(menusData.slice(0, 3));
            for (var m in menusData) {
                if (menusData[m].max3sum <= max3limit) {
                    menusData.splice(m, 1);
                }
            }
        }

        var maxChefs = new Array();
        var maxRecipes = new Array();
        var maxScore = 0;

        var chefsCombs = combinations(menusData, 3);
        totalCount = chefsCombs.length;
        for (var i in chefsCombs) {
            var progress = Math.floor((Math.floor(i) + 1) * 100 / totalCount);
            postMessage({ "progress": { "value": progress, "display": Math.floor(i) + 1 + " / " + totalCount } });

            var combs = new Array();
            var maxSum = 0;
            for (var j in chefsCombs[i]) {
                var recipesCombs = combinations(chefsCombs[i][j].recipes, 3);
                maxSum += chefsCombs[i][j].max3sum;
                combs.push(recipesCombs);
            }
            if (maxSum <= maxScore) {
                continue;
            }
            var product = cartesianProduct(combs);
            for (var j in product) {
                var recipeIdArray = new Array();
                var valid = true;
                var sumScore = 0;
                var oneResult = product[j];
                for (var m in oneResult) {
                    var recipesData = oneResult[m];
                    for (var n in recipesData) {
                        if (recipeIdArray.indexOf(recipesData[n].data.recipeId) < 0) {
                            recipeIdArray.push(recipesData[n].data.recipeId);
                            sumScore += recipesData[n].totalScore;
                        } else {
                            valid = false;
                            break;
                        }
                    }
                    if (!valid) {
                        break;
                    }
                }
                if (valid && sumScore > maxScore) {
                    maxScore = sumScore;
                    maxRecipes = oneResult;
                    maxChefs = chefsCombs[i];
                }
            }
        }

        menusData = new Array();
        for (var i in maxChefs) {
            var menuData = new Object();
            menuData["chef"] = maxChefs[i].chef;
            menuData["recipes"] = maxRecipes[i];

            menusData.push(menuData);
        }

    }

    var finalData = new Array();
    for (var i in menusData) {
        for (var j in menusData[i].recipes) {
            var oneMenu = new Object();
            oneMenu["chef"] = menusData[i].chef;
            oneMenu["recipe"] = menusData[i].recipes[j];
            finalData.push(oneMenu);
        }
    }

    postMessage({ "menu": finalData });;

}

function getMin3Sum(recipesData) {
    var sum = 0;
    var fromIndex = recipesData.length - 3 > 0 ? recipesData.length - 3 : 0;
    for (var m = fromIndex; m < recipesData.length; m++) {
        sum += recipesData[m].totalScore;
    }
    return sum;
}

function getMax3Sum(recipesData) {
    var sum = 0;
    var toIndex = recipesData.length > 3 ? 3 : recipesData.length;
    for (var m = 0; m < toIndex; m++) {
        sum += recipesData[m].totalScore;
    }
    return sum;
}

function getMin3Limit(menusData) {

    var maxScore = 0;

    var combs = new Array();
    for (var i in menusData) {
        var recipesCombs = combinations(menusData[i].recipes, 3);
        combs.push(recipesCombs);
    }
    var product = cartesianProduct(combs);
    for (var j in product) {
        var recipeIdArray = new Array();
        var valid = true;
        var sumScore = 0;
        var oneResult = product[j];
        for (var m in oneResult) {
            var recipesData = oneResult[m];
            for (var n in recipesData) {
                if (recipeIdArray.indexOf(recipesData[n].data.recipeId) < 0) {
                    recipeIdArray.push(recipesData[n].data.recipeId);
                    sumScore += recipesData[n].totalScore;
                } else {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                break;
            }
        }
        if (valid && sumScore > maxScore) {
            maxScore = sumScore;
        }
    }

    return maxScore;
}

function getIngredientsAddition(recipe, ingredients, cumulative) {
    var addition = 0;

    for (var m in recipe.ingredients) {
        for (var n in ingredients) {
            if (recipe.ingredients[m].name == ingredients[n].name) {
                if (cumulative) {
                    addition += Math.floor(ingredients[n].addition);
                    break;
                } else {
                    return Math.floor(ingredients[n].addition);
                }
            }
        }
    }

    return addition;
}

function filterRecipes(recipes, ingredients) {
    var returnRecipes = new Array();
    for (var j in recipes) {

        var allExist = true;
        for (var m in recipes[j].ingredients) {
            var exist = false;
            for (var n in ingredients) {
                if (recipes[j].ingredients[m].name == ingredients[n].name) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                allExist = false;
                break;
            }
        }

        if (!allExist) {
            continue;
        }

        returnRecipes.push(recipes[j]);
    }
    return returnRecipes;
}

function combinations(set, k) {
    var i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
        return [];
    }

    if (k == set.length) {
        return [set];
    }

    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }

    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i + 1);
        tailcombs = combinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

function cartesianProduct(a) {
    var i, j, l, m, a1, o = [];
    if (!a || a.length == 0) return a;

    a1 = a.splice(0, 1)[0];
    a = cartesianProduct(a);
    for (i = 0, l = a1.length; i < l; i++) {
        if (a && a.length) for (j = 0, m = a.length; j < m; j++)
            o.push([a1[i]].concat(a[j]));
        else
            o.push([a1[i]]);
    }
    return o;
}

