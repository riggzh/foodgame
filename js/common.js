function getRankInfo(recipe, chef, useEquip, equip) {
    var times = Number.MAX_VALUE;

    setDataForChef2(chef, useEquip, equip);

    if (recipe.stirfry > 0) {
        if (chef.stirfryVal > 0) {
            times = Math.min(times, chef.stirfryVal / recipe.stirfry);
        } else {
            times = 0;
        }
    }
    if (times >= 1) {
        if (recipe.boil > 0) {
            if (chef.boilVal > 0) {
                times = Math.min(times, chef.boilVal / recipe.boil);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.knife > 0) {
            if (chef.knifeVal > 0) {
                times = Math.min(times, chef.knifeVal / recipe.knife);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.fry > 0) {
            if (chef.fryVal > 0) {
                times = Math.min(times, chef.fryVal / recipe.fry);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.bake > 0) {
            if (chef.bakeVal > 0) {
                times = Math.min(times, chef.bakeVal / recipe.bake);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.steam > 0) {
            if (chef.steamVal > 0) {
                times = Math.min(times, chef.steamVal / recipe.steam);
            } else {
                times = 0;
            }
        }
    }

    var rankInfo = new Object();

    var rankAddition = 0;
    var rankDisp = "-";
    var rankVal = 0;

    if (times != Number.MAX_VALUE && times >= 1) {
        if (times >= 4) {
            rankAddition = 0.5;
            rankDisp = "神";
            rankVal = 4;
        } else if (times >= 3) {
            rankAddition = 0.3;
            rankDisp = "特";
            rankVal = 3;
        } else if (times >= 2) {
            rankAddition = 0.1;
            rankDisp = "优";
            rankVal = 2;
        } else if (times >= 1) {
            rankAddition = 0;
            rankDisp = "可";
            rankVal = 1;
        }
    }

    rankInfo["rankAddition"] = rankAddition;
    rankInfo["rankDisp"] = rankDisp;
    rankInfo["rankVal"] = rankVal;
    return rankInfo;
}

function getSkillAddition(recipe, skill, materials) {
    var skillAddition = 0;
    for (var k in skill) {
        var hasSkill = false;
        if (skill[k].type.indexOf("水产料理售价") >= 0) {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "鱼塘") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (skill[k].type.indexOf("面类料理售价") >= 0) {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "作坊") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (skill[k].type.indexOf("肉类料理售价") >= 0) {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "牧场"
                    || recipe.materials[m].origin == "鸡舍"
                    || recipe.materials[m].origin == "猪圈") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (skill[k].type.indexOf("蔬菜料理售价") >= 0) {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "菜棚"
                    || recipe.materials[m].origin == "菜地"
                    || recipe.materials[m].origin == "森林") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (skill[k].type.indexOf("炒类料理售价") >= 0) {
            if (recipe.stirfry > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("煮类料理售价") >= 0) {
            if (recipe.boil > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("炸类料理售价") >= 0) {
            if (recipe.fry > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("切类料理售价") >= 0) {
            if (recipe.knife > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("烤类料理售价") >= 0) {
            if (recipe.bake > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("蒸类料理售价") >= 0) {
            if (recipe.steam > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("金币获得") >= 0) {
            hasSkill = true;
        } else if (skill[k].type.indexOf("营业收入") >= 0) {
            hasSkill = true;
        }

        if (hasSkill) {
            skillAddition = skillAddition.add(skill[k].addition);
        }
    }

    return skillAddition;
}

function getMaterialsAddition(recipe, materials) {
    var addition = 0;

    for (var m in recipe.materials) {
        for (var n in materials) {
            if (recipe.materials[m].material == materials[n].materialId) {
                if (materials[n].addition) {
                    addition = addition.add(Number(materials[n].addition));
                    break;
                }
            }
        }
    }
    return addition;
}

function getAdditionDisp(addition) {
    if (addition) {
        return addition.mul(100) + "%";
    } else {
        return "";
    }
}

function getRecipeQuantity(recipe, materials, rule) {
    var quantity = 1;
    if (rule.DisableMultiCookbook == false) {
        quantity = recipe.limitVal;
    }

    for (var m in recipe.materials) {
        var exist = false;
        for (var n in materials) {
            if (recipe.materials[m].material == materials[n].materialId) {
                exist = true;
                if (materials[n].quantity) {
                    var tt = Math.floor(materials[n].quantity / recipe.materials[m].quantity);
                    if (tt < quantity) {
                        quantity = tt;
                    }
                    break;
                } else if (materials[n].quantity === 0) {
                    return 0;
                }
            }
        }
        if (!exist) {
            return 0;
        }
    }

    if (quantity < 0) {
        return 0;
    }

    return quantity;
}

function getRecipeResult(chef, equip, recipe, quantity, maxQuantity, materials, rule, decoration) {

    var resultData = new Object();

    var rankAddition = 0;
    var chefSkillAddition = 0;
    var equipSkillAddition = 0;
    var decorationAddition = 0;
    var otherAddition = 0;

    if (chef) {
        var rankData = getRankInfo(recipe, chef, true, equip);
        if (rankData.rankVal == 0) {
            return null;
        }

        if (rule.DisableCookbookRank == false) {
            rankAddition = rankData.rankAddition;
        }

        resultData["rankVal"] = rankData.rankVal;
        resultData["rankDisp"] = rankData.rankDisp;
        resultData["rankAddition"] = rankAddition;
        resultData["rankAdditionDisp"] = getAdditionDisp(rankAddition);

        if (rule.DisableChefSkillEffect == false) {
            chefSkillAddition = getSkillAddition(recipe, chef.specialSkillEffect, materials);
        }

        resultData["chefSkillAddition"] = chefSkillAddition;
        resultData["chefSkillAdditionDisp"] = getAdditionDisp(chefSkillAddition);

        if (rule.DisableEquipSkillEffect == false) {
            var equipEffect = new Array();
            if (equip) {
                equipEffect = equip.effect;
            }
            equipSkillAddition = getSkillAddition(recipe, equipEffect, materials);
        }

        resultData["equipSkillAddition"] = equipSkillAddition;
        resultData["equipSkillAdditionDisp"] = getAdditionDisp(equipSkillAddition);


        otherAddition = otherAddition.add(Number(chef.addition));
    }

    if (rule.DisableDecorationEffect == false) {
        if (decoration) {
            decorationAddition = Number(decoration).div(100);
        }
    }
    resultData["decorationAddition"] = decorationAddition;
    resultData["decorationAdditionDisp"] = getAdditionDisp(decorationAddition);

    otherAddition = otherAddition.add(Number(recipe.addition));

    var materialsAddition = getMaterialsAddition(recipe, materials);
    otherAddition = otherAddition.add(materialsAddition);

    resultData["data"] = recipe;
    resultData["quantity"] = quantity;
    resultData["max"] = maxQuantity;
    resultData["limit"] = quantity;
    resultData["otherAddition"] = otherAddition;
    resultData["otherAdditionDisp"] = getAdditionDisp(otherAddition);
    resultData["totalPrice"] = recipe.price * quantity;
    resultData["realPrice"] = Math.ceil(recipe.price * (1 + rankAddition + chefSkillAddition + equipSkillAddition + decorationAddition + recipe.ultimateAddition));
    resultData["totalRealPrice"] = resultData.realPrice * quantity;
    resultData["bonusScore"] = Math.ceil(recipe.price * otherAddition);
    resultData["totalBonusScore"] = resultData.bonusScore * quantity;
    resultData["totalScore"] = resultData.totalRealPrice + resultData.totalBonusScore;

    return resultData;
}

function getEquipInfo(equipName, equips) {
    var info = new Object();
    if (equipName) {
        for (var j in equips) {
            if (equipName == equips[j].name) {
                info["name"] = equips[j].name;
                info["effect"] = equips[j].effect;
                info["disp"] = equips[j].name + "<br><small>" + equips[j].skillDisp + "</small>";
                break;
            }
        }
    }
    return info;
}

function setDataForChef2(chef, useEquip, equip) {
    chef["stirfryVal"] = chef.stirfry;
    chef["boilVal"] = chef.boil;
    chef["knifeVal"] = chef.knife;
    chef["fryVal"] = chef.fry;
    chef["bakeVal"] = chef.bake;
    chef["steamVal"] = chef.steam;

    chef["stirfryDisp"] = chef.stirfry || "";
    chef["boilDisp"] = chef.boil || "";
    chef["knifeDisp"] = chef.knife || "";
    chef["fryDisp"] = chef.fry || "";
    chef["bakeDisp"] = chef.bake || "";
    chef["steamDisp"] = chef.steam || "";

    var stirfryAddition = chef.stirfryUltimateAddition;
    var boilAddition = chef.boilUltimateAddition;
    var knifeAddition = chef.knifeUltimateAddition;
    var fryAddition = chef.fryUltimateAddition;
    var bakeAddition = chef.bakeUltimateAddition;
    var steamAddition = chef.steamUltimateAddition;

    if (useEquip && equip) {
        var effect = equip.effect;
        for (var i in effect) {
            var type = effect[i].type;
            var addition = effect[i].addition;
            if (type.indexOf("炒技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    stirfryAddition += addition;
                } else {
                    stirfryAddition += chef.stirfry * addition;
                }
            }
            if (type.indexOf("煮技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    boilAddition += addition;
                } else {
                    boilAddition += chef.boil * addition;
                }
            }
            if (type.indexOf("切技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    knifeAddition += addition;
                } else {
                    knifeAddition += chef.knife * addition;
                }
            }
            if (type.indexOf("炸技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    fryAddition += addition;
                } else {
                    fryAddition += chef.fry * addition;
                }
            }
            if (type.indexOf("烤技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    bakeAddition += addition;
                } else {
                    bakeAddition += chef.bake * addition;
                }
            }
            if (type.indexOf("蒸技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    steamAddition += addition;
                } else {
                    steamAddition += chef.steam * addition;
                }
            }
        }
    }

    if (stirfryAddition) {
        stirfryAddition = Math.ceil(stirfryAddition)
        chef.stirfryVal += stirfryAddition;
        chef.stirfryDisp += "+" + stirfryAddition;
    }
    if (boilAddition) {
        boilAddition = Math.ceil(boilAddition)
        chef.boilVal += boilAddition;
        chef.boilDisp += "+" + boilAddition;
    }
    if (knifeAddition) {
        knifeAddition = Math.ceil(knifeAddition)
        chef.knifeVal += knifeAddition;
        chef.knifeDisp += "+" + knifeAddition;
    }
    if (fryAddition) {
        fryAddition = Math.ceil(fryAddition)
        chef.fryVal += fryAddition;
        chef.fryDisp += "+" + fryAddition;
    }
    if (bakeAddition) {
        bakeAddition = Math.ceil(bakeAddition)
        chef.bakeVal += bakeAddition;
        chef.bakeDisp += "+" + bakeAddition;
    }
    if (steamAddition) {
        steamAddition = Math.ceil(steamAddition)
        chef.steamVal += steamAddition;
        chef.steamDisp += "+" + steamAddition;
    }

    chef["disp"] = chef.name + "<br><small>";
    var count = 0;
    if (chef.stirfryDisp) {
        chef.disp += "炒" + chef.stirfryDisp + " ";
        count++;
    }
    if (chef.boilDisp) {
        chef.disp += "煮" + chef.boilDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.knifeDisp) {
        chef.disp += "切" + chef.knifeDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.fryDisp) {
        chef.disp += "炸" + chef.fryDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.bakeDisp) {
        chef.disp += "烤" + chef.bakeDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.steamDisp) {
        chef.disp += "蒸" + chef.steamDisp + " ";
    }
    chef.disp += "</small>"
}

function isInt(n) {
    return n % 1 === 0;
}

function accAdd(arg1, arg2) {
    if (isNaN(arg1)) {
        arg1 = 0;
    }
    if (isNaN(arg2)) {
        arg2 = 0;
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

Number.prototype.add = function (arg) {
    return accAdd(this, arg);
};

function accSub(arg1, arg2) {
    if (isNaN(arg1)) {
        arg1 = 0;
    }
    if (isNaN(arg2)) {
        arg2 = 0;
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);

    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

Number.prototype.sub = function (arg) {
    return accSub(this, arg);
};

function accMul(arg1, arg2) {
    if (isNaN(arg1)) {
        arg1 = 0;
    }
    if (isNaN(arg2)) {
        arg2 = 0;
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);

    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

Number.prototype.mul = function (arg) {
    return accMul(this, arg);
};

function accDiv(arg1, arg2) {
    if (isNaN(arg1)) {
        arg1 = 0;
    }
    if (isNaN(arg2)) {
        arg2 = 0;
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);

    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};