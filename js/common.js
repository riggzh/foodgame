function getSkillInfo(skill) {
    var skillInfo = new Object();
    var skillDisp = "";
    var skillVal = "";
    for (var j in skill) {
        skillDisp += skill[j].type + " ";
        if (skill[j].type.indexOf("稀有客人") >= 0
            || skill[j].type.indexOf("料理") >= 0
            || skill[j].type.indexOf("金币获得") >= 0
            || skill[j].type.indexOf("素材获得") >= 0
            || skill[j].type.indexOf("开业时间") >= 0) {
            if (skill[j].addition > 0) {
                skillDisp += "+";
            }
            skillDisp += mul(skill[j].addition, 100) + "%<br>";
        } else if (skill[j].type.indexOf("技法") >= 0
            || skill[j].type.indexOf("采集") >= 0) {
            if (skill[j].addition > 0) {
                skillDisp += "+";
            }
            skillDisp += skill[j].addition + "<br>";
        } else {
            skillDisp += skill[j].addition + "<br>";
        }

        skillVal += skill[j].type;
    }
    skillInfo["skillDisp"] = skillDisp;
    skillInfo["skillVal"] = skillVal;
    return skillInfo;
}

function getQualityInfo(recipe, chef, kitchenware) {
    var times = Number.MAX_VALUE;

    var stirfry = chef.stirfry;
    var boil = chef.boil;
    var cut = chef.cut;
    var fry = chef.fry;
    var roast = chef.roast;
    var steam = chef.steam;

    if (kitchenware) {
        var skill = kitchenware.skill;
        for (var i in skill) {
            if (skill[i].type.indexOf("炒技法") >= 0
                || skill[i].type.indexOf("全技法") >= 0) {
                stirfry += skill[i].addition;
            } else if (skill[i].type.indexOf("煮技法") >= 0
                || skill[i].type.indexOf("全技法") >= 0) {
                boil += skill[i].addition;
            } else if (skill[i].type.indexOf("切技法") >= 0
                || skill[i].type.indexOf("全技法") >= 0) {
                cut += skill[i].addition;
            } else if (skill[i].type.indexOf("炸技法") >= 0
                || skill[i].type.indexOf("全技法") >= 0) {
                fry += skill[i].addition;
            } else if (skill[i].type.indexOf("烤技法") >= 0
                || skill[i].type.indexOf("全技法") >= 0) {
                roast += skill[i].addition;
            } else if (skill[i].type.indexOf("蒸技法") >= 0
                || skill[i].type.indexOf("全技法") >= 0) {
                steam += skill[i].addition;
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
        if (recipe.cut > 0) {
            if (cut > 0) {
                times = Math.min(times, cut / recipe.cut);
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
        if (recipe.roast > 0) {
            if (roast > 0) {
                times = Math.min(times, roast / recipe.roast);
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

    var qualityInfo = new Object();

    var qualityAddition = 0;
    var qualityDisp = "-";
    var qualityVal = 0;

    if (times != Number.MAX_VALUE && times >= 1) {
        if (times >= 4) {
            qualityAddition = 0.5;
            qualityDisp = "神";
            qualityVal = 4;
        } else if (times >= 3) {
            qualityAddition = 0.3;
            qualityDisp = "特";
            qualityVal = 3;
        } else if (times >= 2) {
            qualityAddition = 0.1;
            qualityDisp = "优";
            qualityVal = 2;
        } else if (times >= 1) {
            qualityAddition = 0;
            qualityDisp = "可";
            qualityVal = 1;
        }
    }

    qualityInfo["qualityAddition"] = qualityAddition;
    qualityInfo["qualityDisp"] = qualityDisp;
    qualityInfo["qualityVal"] = qualityVal;
    return qualityInfo;
}

function getSkillAddition(recipe, skill, ingredients) {
    var skillAddition = 0;
    for (var k in skill) {
        var hasSkill = false;
        if (skill[k].type.indexOf("水产料理") >= 0) {
            for (var m in recipe.ingredients) {
                for (var n in ingredients) {
                    if (recipe.ingredients[m].name == ingredients[n].name) {
                        if (ingredients[n].origin == "鱼塘") {
                            hasSkill = true;
                            break;
                        }
                    }
                }
            }
        } else if (skill[k].type.indexOf("面类料理") >= 0) {
            for (var m in recipe.ingredients) {
                for (var n in ingredients) {
                    if (recipe.ingredients[m].name == ingredients[n].name) {
                        if (ingredients[n].origin == "作坊") {
                            hasSkill = true;
                            break;
                        }
                    }
                }
            }
        } else if (skill[k].type.indexOf("肉类料理") >= 0) {
            for (var m in recipe.ingredients) {
                for (var n in ingredients) {
                    if (recipe.ingredients[m].name == ingredients[n].name) {
                        if (ingredients[n].origin == "牧场"
                            || ingredients[n].origin == "鸡舍"
                            || ingredients[n].origin == "猪圈") {
                            hasSkill = true;
                            break;
                        }
                    }
                }
            }
        } else if (skill[k].type.indexOf("蔬菜料理") >= 0) {
            for (var m in recipe.ingredients) {
                for (var n in ingredients) {
                    if (recipe.ingredients[m].name == ingredients[n].name) {
                        if (ingredients[n].origin == "菜棚"
                            || ingredients[n].origin == "菜地"
                            || ingredients[n].origin == "森林") {
                            hasSkill = true;
                            break;
                        }
                    }
                }
            }
        } else if (skill[k].type.indexOf("炒类料理") >= 0) {
            if (recipe.stirfry > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("煮类料理") >= 0) {
            if (recipe.boil > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("炸类料理") >= 0) {
            if (recipe.fry > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("切类料理") >= 0) {
            if (recipe.cut > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("烤类料理") >= 0) {
            if (recipe.roast > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("蒸类料理") >= 0) {
            if (recipe.steam > 0) {
                hasSkill = true;
            }
        } else if (skill[k].type.indexOf("金币获得") >= 0) {
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

