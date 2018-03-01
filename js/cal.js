importScripts('food.min.js?v=21');

onmessage = function (e) {
    calculateMenu(e.data);
}

function calculateMenu(data) {

    var ingredients = data.ingredients;
    var recipes = filterRecipes(data.recipes, data.ingredients);
    var chefs = data.chefs;
    var mode = data.mode

    if (mode == "optimal") {
        if (chefs.length < data.optimalChefsNum) {
            postMessage({ "menu": new Array(), "message": "无解，请检查配置" });
            return;
        }
        if (recipes.length < data.optimalChefsNum * data.optimalRecipesNum) {
            postMessage({ "menu": new Array(), "message": "无解，请检查配置" });
            return;
        }
    }

    var totalCount = chefs.length;
    var currentProgress = 0;

    var menusData = new Array();

    for (var i in chefs) {

        if (mode == "all") {
            var progress = Math.floor((Math.floor(i) + 1) * 100 / totalCount);
            postMessage({ "progress": { "value": progress, "display": Math.floor(i) + 1 + " / " + totalCount } });
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

        var limit = 0;
        if (mode == "all") {
            limit = data.allLimit;
        } else {
            limit = data.optimalChefsNum * data.optimalRecipesNum;
        }

        var maxSize = Math.min(limit, recipesData.length);
        recipesData = recipesData.slice(0, maxSize);

        var menuData = new Object();
        menuData["chef"] = chefs[i];
        menuData["recipes"] = recipesData;

        if (mode == "optimal") {
            menuData["minNSum"] = getMinNSum(recipesData, data.optimalRecipesNum);
            menuData["maxNSum"] = getMaxNSum(recipesData, data.optimalRecipesNum);
        }

        menusData.push(menuData);
    }

    if (mode == "optimal") {

        if (menusData.length > data.optimalChefsNum) {
            menusData.sort(function (a, b) {
                return b.minNSum - a.minNSum
            });

            var maxNLimit = getMaxNLimit(menusData, data.optimalChefsNum, data.optimalRecipesNum);
            for (var m in menusData) {
                if (menusData[m].maxNSum <= maxNLimit) {
                    menusData.splice(m, 1);
                }
            }

            menusData.sort(function (a, b) {
                return b.maxNSum - a.maxNSum
            });
        }

        var maxChefs = new Array();
        var maxRecipes = new Array();
        var maxScore = 0;

        var pickChefs = Math.min(menusData.length, data.optimalChefsNum);
        var chefsCombs = combinations(menusData, pickChefs);
        totalCount = chefsCombs.length;
        for (var i in chefsCombs) {
            var progress = Math.floor((Math.floor(i) + 1) * 100 / totalCount);

            var combs = new Array();
            var maxSum = 0;
            for (var j in chefsCombs[i]) {
                var pickRecipes = Math.min(chefsCombs[i][j].recipes.length, data.optimalRecipesNum);
                var recipesCombs = combinations(chefsCombs[i][j].recipes, pickRecipes);
                maxSum += chefsCombs[i][j].maxNSum;
                combs.push(recipesCombs);
            }
            if (maxSum <= maxScore) {
                if (progress > currentProgress) {
                    postMessage({ "progress": { "value": progress, "display": Math.floor(i) + 1 + " / " + totalCount } });
                    currentProgress = progress;
                }
                continue;
            }
            else {
                postMessage({ "progress": { "value": progress, "display": Math.floor(i) + 1 + " / " + totalCount } });
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

    if (finalData.length < data.optimalChefsNum * data.optimalRecipesNum) {
        postMessage({ "menu": new Array(), "message": "无解，请检查配置" });
    } else {
        postMessage({ "menu": finalData });
    }
}

function getMinNSum(recipesData, num) {
    var sum = 0;
    var fromIndex = Math.max(recipesData.length - num, 0);
    for (var m = fromIndex; m < recipesData.length; m++) {
        sum += recipesData[m].totalScore;
    }
    return sum;
}

function getMaxNSum(recipesData, num) {
    var sum = 0;
    var toIndex = Math.min(recipesData.length, num);
    for (var m = 0; m < toIndex; m++) {
        sum += recipesData[m].totalScore;
    }
    return sum;
}

function getMaxNLimit(menusData, chefsNum, recipesNum) {
    var maxNLimit = 0;
    var count = 0;
    for (var i in menusData) {
        if (menusData[i].recipes.length >= chefsNum * recipesNum) {
            count++;
            if (count == chefsNum) {
                maxNLimit = menusData[i].minNSum;
                break;
            }
        }
    }
    return maxNLimit;
}

function getIngredientsAddition(recipe, ingredients, cumulative) {
    var addition = 0;
    var positiveAddition = 0;
    var negativeAddition = 0;

    for (var m in recipe.ingredients) {
        for (var n in ingredients) {
            if (recipe.ingredients[m].name == ingredients[n].name) {
                if (cumulative) {
                    addition += Math.floor(ingredients[n].addition);
                    break;
                } else {
                    if (Math.floor(ingredients[n].addition) > positiveAddition) {
                        positiveAddition = Math.floor(ingredients[n].addition);
                    } else if (Math.floor(ingredients[n].addition) < 0) {
                        negativeAddition += Math.floor(ingredients[n].addition);
                    }
                }
            }
        }
    }

    if (cumulative) {
        return addition;
    } else {
        return positiveAddition + negativeAddition;
    }
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