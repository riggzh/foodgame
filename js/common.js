function getRankInfo(recipe, chef, equip) {
    var times = Number.MAX_VALUE;

    var stirfry = chef.stirfryVal;
    var boil = chef.boilVal;
    var knife = chef.knifeVal;
    var fry = chef.fryVal;
    var bake = chef.bakeVal;
    var steam = chef.steamVal;

    if (equip) {
        var effect = equip.effect;
        for (var i in effect) {
            var type = effect[i].type;
            var addition = effect[i].addition;
            if (type.indexOf("炒技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    stirfry += addition;
                } else {
                    stirfry = stirfry * (1 + addition);
                }
            } else if (type.indexOf("煮技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    boil += addition;
                } else {
                    boil = boil * (1 + addition);
                }
            } else if (type.indexOf("切技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    knife += addition;
                } else {
                    knife = knife * (1 + addition);
                }
            } else if (type.indexOf("炸技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    fry += addition;
                } else {
                    fry = fry * (1 + addition);
                }
            } else if (type.indexOf("烤技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    bake += addition;
                } else {
                    bake = bake * (1 + addition);
                }
            } else if (type.indexOf("蒸技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    steam += addition;
                } else {
                    steam = steam * (1 + addition);
                }
            }
        }
    }

    if (recipe.stirfry > 0) {
        if (stirfry > 0) {
            times = Math.min(times, stirfry / recipe.stirfry);
        } else {
            times = 0;
        }
    }
    if (times >= 1) {
        if (recipe.boil > 0) {
            if (boil > 0) {
                times = Math.min(times, boil / recipe.boil);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.knife > 0) {
            if (knife > 0) {
                times = Math.min(times, knife / recipe.knife);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.fry > 0) {
            if (fry > 0) {
                times = Math.min(times, fry / recipe.fry);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.bake > 0) {
            if (bake > 0) {
                times = Math.min(times, bake / recipe.bake);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.steam > 0) {
            if (steam > 0) {
                times = Math.min(times, steam / recipe.steam);
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
            skillAddition += skill[k].addition;
        }
    }

    return skillAddition;
}

function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) { }
    try {
        c += e.split(".")[1].length;
    } catch (f) { }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}


function isInt(n) {
    return n % 1 === 0;
}