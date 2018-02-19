$(function () {
    $.ajax({
        cache: false,
        success: function (data) {
            init(data);
        },
        url: 'data/data.json'
    });
});

function init(json) {
    var private = window.location.search.indexOf("666") > 0;
    var data = generateData(json, private);

    initRecipeTable(data, private);

    initChefTable(data, private);

    initInfo(data, private);

    $('.loading').hide();
    $('#info').removeClass("hidden");
    $('#main-recipe').removeClass("hidden");
}

function initRecipeTable(data, private) {
    var recipeColumns = [
        {
            "data": "recipeId"
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "fire.value",
                "display": "fire.display"
            }
        },
        {
            "data": "stirfry"
        },
        {
            "data": "boil"
        },
        {
            "data": "cut"
        },
        {
            "data": "fry"
        },
        {
            "data": "roast"
        },
        {
            "data": "steam"
        },
        {
            "data": {
                "_": "ingredients.value",
                "display": "ingredients.display"
            }
        },
        {
            "data": "price"
        },
        {
            "data": {
                "_": "time.value",
                "display": "time.display"
            }
        },
        {
            "data": "total"
        },
        {
            "data": "totalPrice"
        },
        {
            "data": {
                "_": "totalTime.value",
                "display": "totalTime.display"
            }
        },
        {
            "data": "efficiency"
        },
        {
            "data": "ingredientsEff"
        },
        {
            "data": "origin"
        },
        {
            "data": "unlock"
        },
        {
            "data": "guests"
        },
        {
            "data": {
                "_": "levelGuests.value",
                "display": "levelGuests.display"
            }
        },
        {
            "data": "godRune"
        },
        {
            "data": "get"
        },
        {
            "data": "quality"
        },
        {
            "data": "remark"
        }
    ];

    for (j in data.chefs) {
        $('#chk-recipe-show-chef').append("<option value='" + j + "'>" + data.chefs[j].name + "</option>");
        $('#recipe-table thead tr').append("<th>" + data.chefs[j].name + "</th>").append("<th>效率</th>");

        recipeColumns.push({
            "data": {
                "_": "chefs." + j + ".chefQlty.value",
                "display": "chefs." + j + ".chefQlty.display"
            },
            "searchable": false
        });
        recipeColumns.push({
            "data": "chefs." + j + ".chefEff",
            "searchable": false
        });
    }

    var recipeTable = $('#recipe-table').DataTable({
        data: data.recipes,
        "columns": recipeColumns,
        "language": {
            "search": "查找:",
            "lengthMenu": "一页显示 _MENU_ 个",
            "zeroRecords": "没有找到",
            "info": "第 _PAGE_ 页 共 _PAGES_ 页 _TOTAL_ 个菜谱",
            "infoEmpty": "没有数据",
            "infoFiltered": "(从 _MAX_ 个菜谱中过滤)"
        },
        "pagingType": "numbers",
        "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "所有"]],
        "pageLength": 20,
        "dom": "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        fixedHeader: true
    });

    recipeTable.fixedHeader.disable();

    $("#main-recipe div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="菜名 材料 贵客 符文"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        var chkFire0 = $('#chk-recipe-fire-0').prop("checked");
        var chkFire1 = $('#chk-recipe-fire-1').prop("checked");
        var chkFire2 = $('#chk-recipe-fire-2').prop("checked");
        var chkFire3 = $('#chk-recipe-fire-3').prop("checked");
        var chkFire4 = $('#chk-recipe-fire-4').prop("checked");
        var chkFire5 = $('#chk-recipe-fire-5').prop("checked");
        var fire = parseInt(data[2]) || 0;

        if (chkFire0 && fire == 0
            || chkFire1 && fire == 1
            || chkFire2 && fire == 2
            || chkFire3 && fire == 3
            || chkFire4 && fire == 4
            || chkFire5 && fire == 5) {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        if ($('#chk-recipe-skill-stirfry').prop("checked") && (parseInt(data[3]) || 0) > 0
            || $('#chk-recipe-skill-boil').prop("checked") && (parseInt(data[4]) || 0) > 0
            || $('#chk-recipe-skill-cut').prop("checked") && (parseInt(data[5]) || 0) > 0
            || $('#chk-recipe-skill-fry').prop("checked") && (parseInt(data[6]) || 0) > 0
            || $('#chk-recipe-skill-roast').prop("checked") && (parseInt(data[7]) || 0) > 0
            || $('#chk-recipe-skill-steam').prop("checked") && (parseInt(data[8]) || 0) > 0
            || ($('#chk-recipe-skill-unknown').prop("checked") && (parseInt(data[3]) || 0) == 0 && (parseInt(data[4]) || 0) == 0 && (parseInt(data[5]) || 0) == 0
                && (parseInt(data[6]) || 0) == 0 && (parseInt(data[7]) || 0) == 0 && (parseInt(data[8]) || 0) == 0)
        ) {
            return true;
        } else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        var min = parseInt($('#input-recipe-price').val());
        var price = parseFloat(data[10]) || 0;

        if (isNaN(min) || min < price) {
            return true;
        } else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        var check = $('#chk-recipe-guest').prop("checked");
        var value = data[19];

        if (!check || check && value) {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        var value = $("#input-recipe-guest-rune").val();
        var searchCols = [20, 21];

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        var value = $("#main-recipe .search-box input").val().toLowerCase();
        var searchCols = [0, 1, 9, 19];

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].toLowerCase().indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('#chk-recipe-show-chef').multiselect({
        templates: {
            filter: '<li class="multiselect-item filter">'
                + '<div class="input-group">'
                + '<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>'
                + '<input class="form-control multiselect-search" type="text"></div>'
                + '<a class="deselect-all">清空</a></li>'
        },
        enableFiltering: true,
        filterPlaceholder: '查找',
        numberDisplayed: 1,
        allSelectedText: '厨师',
        nonSelectedText: '厨师',
        nSelectedText: '厨师',
        maxHeight: 200,
        onChange: function (option, checked, select) {
            initRecipeShow(recipeTable, data, private);
        }
    });

    $('.chk-recipe-show-chef-wrapper .deselect-all').click(function () {
        $('#chk-recipe-show-chef').multiselect('deselectAll', false);
        $('#chk-recipe-show-chef').multiselect('updateButtonText');
        initRecipeShow(recipeTable, data, private);
    });

    $('.chk-recipe-show').click(function () {
        initRecipeShow(recipeTable, data, private);
    });

    $('#chk-recipe-show-all').click(function () {
        if ($('.btn:not(.hidden) .chk-recipe-show:checked').length == $('.btn:not(.hidden) .chk-recipe-show').length) {
            $('.btn:not(.hidden) .chk-recipe-show').prop("checked", false);
        }
        else {
            $('.btn:not(.hidden) .chk-recipe-show').prop("checked", true);
        }
        initRecipeShow(recipeTable, data, private);
    });

    $('#chk-recipe-fixed-header').change(function () {
        if ($(this).prop("checked")) {
            recipeTable.fixedHeader.enable();
        } else {
            recipeTable.fixedHeader.disable();
        }
    });

    $('.chk-recipe-fire input[type="checkbox"]').click(function () {
        recipeTable.draw();
    });

    $('.chk-recipe-skill').click(function () {
        if ($(this).prop("checked")) {
            if ($('#chk-recipe-single-skill').prop("checked")) {
                $(".chk-recipe-skill").not(this).prop("checked", false);
            }
        }

        recipeTable.draw();
    });

    $('#chk-recipe-single-skill').change(function () {
        if ($(this).prop("checked")) {
            if ($('.chk-recipe-skill:checked').length > 1) {
                $('.chk-recipe-skill').prop("checked", false);
                recipeTable.draw();
            }
        }
    });

    $('#chk-recipe-skill-all').click(function () {
        if ($('#chk-recipe-single-skill').prop("checked")) {
            $('#chk-recipe-single-skill').bootstrapToggle('off')
        }
        $(".chk-recipe-skill").prop("checked", true);
        recipeTable.draw();
    });

    $('#input-recipe-price').keyup(function () {
        recipeTable.draw();
    });

    $('#input-recipe-guest-rune').keyup(function () {
        recipeTable.draw();
    });

    $('#chk-recipe-guest').click(function () {
        recipeTable.draw();
    });

    $('#main-recipe .search-box input').keyup(function () {
        recipeTable.draw();
    });


    if (private) {
        $('#chk-recipe-show-origin').prop("checked", false)
        $('#chk-recipe-show-get').parent(".btn").removeClass('hidden');
        $('#chk-recipe-show-quality').prop("checked", true).parent(".btn").removeClass('hidden');
        $('#chk-recipe-show-remark').prop("checked", true).parent(".btn").removeClass('hidden');
        $('#chk-recipe-fixed-header').parent(".btn").removeClass('hidden');

        $('#chk-recipe-get').prop("checked", true).parents(".box").removeClass('hidden');
        $('#chk-recipe-get').click(function () {
            recipeTable.draw();
        });
        $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
            if (settings.nTable != document.getElementById('recipe-table')) {
                return true;
            }

            var check = $('#chk-recipe-get').prop("checked");
            var value = data[22];

            if (!check || check && value == "true") {
                return true;
            }
            else {
                return false;
            }
        });
    }

    initRecipeShow(recipeTable, data, private);
}

function initChefTable(data, private) {
    var chefColumns = [
        {
            "data": {
                "_": "chefId.value",
                "display": "chefId.display"
            }
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "fire.value",
                "display": "fire.display"
            }
        },
        {
            "data": "stirfry"
        },
        {
            "data": "boil"
        },
        {
            "data": "cut"
        },
        {
            "data": "fry"
        },
        {
            "data": "roast"
        },
        {
            "data": "steam"
        },
        {
            "data": {
                "_": "specialSkill.value",
                "display": "specialSkill.display"
            }
        },
        {
            "data": "meat"
        },
        {
            "data": "wheat"
        },
        {
            "data": "veg"
        },
        {
            "data": "fish"
        },
        {
            "data": "sex"
        },
        {
            "data": "origin"
        }
    ];

    for (j in data.recipes) {
        $('#chk-chef-show-recipe').append("<option value='" + j + "'>" + data.recipes[j].name + "</option>");
        $('#chef-table thead tr').append("<th>" + data.recipes[j].name + "</th>");

        chefColumns.push({
            "data": {
                "_": "recipes." + j + ".recipeQlty.value",
                "display": "recipes." + j + ".recipeQlty.display"
            },
            "searchable": false
        });
    }

    var chefTable = $('#chef-table').DataTable({
        data: data.chefs,
        "columns": chefColumns,
        "language": {
            "search": "查找:",
            "lengthMenu": "一页显示 _MENU_ 个",
            "zeroRecords": "没有找到",
            "info": "第 _PAGE_ 页 共 _PAGES_ 页 _TOTAL_ 个厨师",
            "infoEmpty": "没有数据",
            "infoFiltered": "(从 _MAX_ 个厨师中过滤)"
        },
        "pagingType": "numbers",
        "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "所有"]],
        "pageLength": 20,
        "dom": "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        fixedHeader: true
    });

    chefTable.fixedHeader.disable();

    $("#main-chef div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 技能 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('chef-table')) {
            return true;
        }

        var chkFire1 = $('#chk-chef-fire-1').prop("checked");
        var chkFire2 = $('#chk-chef-fire-2').prop("checked");
        var chkFire3 = $('#chk-chef-fire-3').prop("checked");
        var chkFire4 = $('#chk-chef-fire-4').prop("checked");
        var chkFire5 = $('#chk-chef-fire-5').prop("checked");
        var fire = parseInt(data[2]) || 0;

        if (chkFire1 && fire == 1
            || chkFire2 && fire == 2
            || chkFire3 && fire == 3
            || chkFire4 && fire == 4
            || chkFire5 && fire == 5) {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('chef-table')) {
            return true;
        }

        var stirfryMin = parseInt($('#input-chef-stirfry').val());
        var stirfry = parseInt(data[3]) || 0;
        var boilMin = parseInt($('#input-chef-boil').val());
        var boil = parseInt(data[4]) || 0;
        var cutMin = parseInt($('#input-chef-cut').val());
        var cut = parseInt(data[5]) || 0;
        var fryMin = parseInt($('#input-chef-fry').val());
        var fry = parseInt(data[6]) || 0;
        var roastMin = parseInt($('#input-chef-roast').val());
        var roast = parseInt(data[7]) || 0;
        var steamMin = parseInt($('#input-chef-steam').val());
        var steam = parseInt(data[8]) || 0;

        if ((isNaN(stirfryMin) || stirfryMin <= stirfry)
            && (isNaN(boilMin) || boilMin <= boil)
            && (isNaN(cutMin) || cutMin <= cut)
            && (isNaN(fryMin) || fryMin <= fry)
            && (isNaN(roastMin) || roastMin <= roast)
            && (isNaN(steamMin) || steamMin <= steam)) {
            return true;
        } else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('chef-table')) {
            return true;
        }

        var chkMale = $('#chk-chef-sex-male').prop("checked");
        var chkFemale = $('#chk-chef-sex-female').prop("checked");
        var sex = data[14];

        if (chkMale && sex == "男"
            || chkFemale && sex == "女") {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('chef-table')) {
            return true;
        }

        var value = $("#main-chef .search-box input").val().toLowerCase();
        var searchCols = [1, 9, 15];

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].toLowerCase().indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('#chk-chef-show-recipe').multiselect({
        templates: {
            filter: '<li class="multiselect-item filter">'
                + '<div class="input-group">'
                + '<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>'
                + '<input class="form-control multiselect-search" type="text"></div>'
                + '<a class="deselect-all">清空</a></li>'
        },
        enableFiltering: true,
        filterPlaceholder: '查找',
        numberDisplayed: 1,
        allSelectedText: '菜谱',
        nonSelectedText: '菜谱',
        nSelectedText: '菜谱',
        maxHeight: 200,
        onChange: function (option, checked, select) {
            initChefShow(chefTable, data, private);
        }
    });

    $('.chk-chef-show-recipe-wrapper .deselect-all').click(function () {
        $('#chk-chef-show-recipe').multiselect('deselectAll', false);
        $('#chk-chef-show-recipe').multiselect('updateButtonText');
        initChefShow(chefTable, data, private);
    });

    $('.chk-chef-show').click(function () {
        initChefShow(chefTable, data, private);
    });

    $('#chk-chef-show-all').click(function () {
        if ($('.btn:not(.hidden) .chk-chef-show:checked').length == $('.btn:not(.hidden) .chk-chef-show').length) {
            $('.btn:not(.hidden) .chk-chef-show').prop("checked", false);
        }
        else {
            $('.btn:not(.hidden) .chk-chef-show').prop("checked", true);
        }
        initChefShow(chefTable, data, private);
    });

    $('#chk-chef-fixed-header').change(function () {
        if ($(this).prop("checked")) {
            chefTable.fixedHeader.enable();
        } else {
            chefTable.fixedHeader.disable();
        }
    });

    $('.chk-chef-fire input[type="checkbox"]').click(function () {
        chefTable.draw();
    });

    $('.input-chef-skill').keyup(function () {
        chefTable.draw();
    });

    $('#btn-chef-skill-clear').click(function () {
        $('.input-chef-skill').val("");
        chefTable.draw();
    });

    $('.chk-chef-sex input[type="checkbox"]').click(function () {
        chefTable.draw();
    });

    $('#main-chef .search-box input').keyup(function () {
        chefTable.draw();
    });

    initChefShow(chefTable, data, private);
}

function generateData(json, private) {
    var retData = new Object();

    var chefsData = new Array();
    var chefsCount = 0;
    for (i in json.chefs) {

        if (!json.chefs[i].name) {
            continue;
        }

        chefsData[chefsCount] = new Object();
        chefsData[chefsCount]["name"] = json.chefs[i].name;
        chefsData[chefsCount]["stirfry"] = json.chefs[i].stirfry || "";
        chefsData[chefsCount]["boil"] = json.chefs[i].boil || "";
        chefsData[chefsCount]["cut"] = json.chefs[i].cut || "";
        chefsData[chefsCount]["fry"] = json.chefs[i].fry || "";
        chefsData[chefsCount]["roast"] = json.chefs[i].roast || "";
        chefsData[chefsCount]["steam"] = json.chefs[i].steam || "";
        chefsData[chefsCount]["skill"] = json.chefs[i].skill;
        chefsData[chefsCount]["origin"] = json.chefs[i].origin;
        chefsData[chefsCount]["sex"] = json.chefs[i].sex;
        chefsData[chefsCount]["meat"] = json.chefs[i].meat || "";
        chefsData[chefsCount]["wheat"] = json.chefs[i].wheat || "";
        chefsData[chefsCount]["veg"] = json.chefs[i].veg || "";
        chefsData[chefsCount]["fish"] = json.chefs[i].fish || "";
        chefsData[chefsCount]["recipes"] = new Array();

        chefsData[chefsCount]["chefId"] = {
            "display": json.chefs[i].chefId + " - " + (json.chefs[i].chefId + 2),
            "value": json.chefs[i].chefId
        };

        var fireDisp = "";
        for (j = 0; j < json.chefs[i].fire; j++) {
            fireDisp += "&#x2605;";
        }
        chefsData[chefsCount]["fire"] = {
            "display": fireDisp,
            "value": json.chefs[i].fire
        };

        var specialSkillDisp = "";
        var specialSkillVal = "";
        for (j in json.chefs[i].skill) {
            specialSkillDisp += json.chefs[i].skill[j].type + " ";
            if (json.chefs[i].skill[j].addition) {
                specialSkillDisp += json.chefs[i].skill[j].addition * 100 + "% ";
            }
            specialSkillVal = json.chefs[i].skill[j].type;
        }

        chefsData[chefsCount]["specialSkill"] = {
            "display": specialSkillDisp,
            "value": specialSkillVal
        };

        chefsCount++;
    }
    retData["chefs"] = chefsData;

    retData["history"] = json.history;

    var recipesData = new Array();
    var dataCount = 0;
    for (i in json.recipes) {

        if (!json.recipes[i].name) {
            continue;
        }

        recipesData[dataCount] = new Object();
        recipesData[dataCount]["recipeId"] = json.recipes[i].recipeId;
        recipesData[dataCount]["name"] = json.recipes[i].name;
        recipesData[dataCount]["stirfry"] = json.recipes[i].stirfry || "";
        recipesData[dataCount]["boil"] = json.recipes[i].boil || "";
        recipesData[dataCount]["cut"] = json.recipes[i].cut || "";
        recipesData[dataCount]["fry"] = json.recipes[i].fry || "";
        recipesData[dataCount]["roast"] = json.recipes[i].roast || "";
        recipesData[dataCount]["steam"] = json.recipes[i].steam || "";
        recipesData[dataCount]["price"] = json.recipes[i].price || "";
        recipesData[dataCount]["time"] = {
            "display": json.recipes[i].time != 0 ? secondsToTime(json.recipes[i].time) : "",
            "value": json.recipes[i].time != 0 ? json.recipes[i].time : ""
        };
        recipesData[dataCount]["total"] = json.recipes[i].total || "";
        recipesData[dataCount]["origin"] = json.recipes[i].origin;
        recipesData[dataCount]["unlock"] = json.recipes[i].unlock;
        recipesData[dataCount]["godRune"] = json.recipes[i].godRune;
        recipesData[dataCount]["get"] = json.recipes[i].hasOwnProperty('personal') ? true : false;
        recipesData[dataCount]["quality"] = json.recipes[i].hasOwnProperty('personal') ? json.recipes[i].personal.quality : "";
        recipesData[dataCount]["remark"] = json.recipes[i].hasOwnProperty('personal') ? json.recipes[i].personal.remark : "";

        var fireDisp = "";
        for (j = 0; j < json.recipes[i].fire; j++) {
            fireDisp += "&#x2605;";
        }
        recipesData[dataCount]["fire"] = {
            "display": fireDisp,
            "value": json.recipes[i].fire
        };

        var totalPrice = 0;
        var totalTime = 0;
        var efficiency = 0;

        if (json.recipes[i].price > 0 && json.recipes[i].time > 0) {

            efficiency = json.recipes[i].price * 3600 / json.recipes[i].time;

            if (json.recipes[i].total > 0) {
                totalPrice = json.recipes[i].price * json.recipes[i].total;
                totalTime = json.recipes[i].time * json.recipes[i].total;
            }
        }

        recipesData[dataCount]["totalPrice"] = totalPrice ? totalPrice : "";
        recipesData[dataCount]["totalTime"] = {
            "display": totalTime ? secondsToTime(totalTime) : "",
            "value": totalTime ? totalTime : ""
        };
        recipesData[dataCount]["efficiency"] = efficiency ? parseInt(efficiency) : "";

        var ingredientsDisp = "";
        var ingredientsVal = "";
        var ingredientsCount = 0;
        for (k in json.recipes[i].ingredient) {
            if (json.recipes[i].ingredient[k].name) {
                ingredientsDisp += json.recipes[i].ingredient[k].name + "*" + json.recipes[i].ingredient[k].quantity + " ";
                ingredientsVal += json.recipes[i].ingredient[k].name;
                ingredientsCount += json.recipes[i].ingredient[k].quantity;
            }
        }
        recipesData[dataCount]["ingredients"] = {
            "display": ingredientsDisp,
            "value": ingredientsVal
        };

        var ingredientsEff = 0;
        if (json.recipes[i].time > 0) {
            ingredientsEff = ingredientsCount * 3600 / json.recipes[i].time;
        }
        recipesData[dataCount]["ingredientsEff"] = ingredientsEff ? parseInt(ingredientsEff) : "";

        var levelGuestsDisp = "";
        var levelGuestsVal = "";
        for (g in json.recipes[i].guests) {
            if (json.recipes[i].guests[g].guest) {
                if (private && json.recipes[i].hasOwnProperty('personal')) {
                    if (json.recipes[i].personal.quality == "优" && json.recipes[i].guests[g].quality == "优"
                        || json.recipes[i].personal.quality == "特" && json.recipes[i].guests[g].quality != "神"
                        || json.recipes[i].personal.quality == "神") {
                        continue;
                    }
                }
                levelGuestsDisp += json.recipes[i].guests[g].quality + "-" + json.recipes[i].guests[g].guest + "<br>";
                levelGuestsVal += json.recipes[i].guests[g].guest;
            }
        }
        recipesData[dataCount]["levelGuests"] = {
            "display": levelGuestsDisp,
            "value": levelGuestsVal
        };

        var guests = "";
        for (m in json.guests) {
            for (n in json.guests[m].gifts) {
                if (json.recipes[i].name == json.guests[m].gifts[n].recipe) {
                    guests += json.guests[m].name + "-" + json.guests[m].gifts[n].rune + "<br>";
                    break;
                }
            }
        }
        recipesData[dataCount]["guests"] = guests;

        recipesData[dataCount]["chefs"] = new Array();
        for (j in retData["chefs"]) {

            var qualityData = getQualityData(json.recipes[i], retData["chefs"][j]);

            var chefEff = 0;

            if (qualityData.qualityVal > 0) {

                var skillAddition = getChefSkillAddition(json.recipes[i], retData["chefs"][j], json.ingredients);

                if (efficiency > 0) {
                    chefEff = (1 + qualityData.qualityAddition + skillAddition + (private ? json.furniture : 0)) * efficiency;
                }
            }

            recipesData[dataCount]["chefs"].push({
                "chefQlty": {
                    "display": qualityData.qualityDisp,
                    "value": qualityData.qualityVal
                },
                "chefEff": chefEff ? parseInt(chefEff) : ""
            });

            retData["chefs"][j]["recipes"].push({
                "recipeQlty": {
                    "display": qualityData.qualityDisp,
                    "value": qualityData.qualityVal
                }
            });
        }

        dataCount++;
    }

    retData["recipes"] = recipesData;

    return retData;
}

function getQualityData(recipe, chef) {
    var times = Number.MAX_VALUE;

    if (recipe.stirfry > 0) {
        if (chef.stirfry > 0) {
            times = Math.min(times, chef.stirfry / recipe.stirfry);
        } else {
            times = 0;
        }
    }
    if (times >= 1) {
        if (recipe.boil > 0) {
            if (chef.boil > 0) {
                times = Math.min(times, chef.boil / recipe.boil);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.cut > 0) {
            if (chef.cut > 0) {
                times = Math.min(times, chef.cut / recipe.cut);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.fry > 0) {
            if (chef.fry > 0) {
                times = Math.min(times, chef.fry / recipe.fry);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.roast > 0) {
            if (chef.roast > 0) {
                times = Math.min(times, chef.roast / recipe.roast);
            } else {
                times = 0;
            }
        }
    }
    if (times >= 1) {
        if (recipe.steam > 0) {
            if (chef.steam > 0) {
                times = Math.min(times, chef.steam / recipe.steam);
            } else {
                times = 0;
            }
        }
    }

    var qualityData = new Object();

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

    qualityData["qualityAddition"] = qualityAddition;
    qualityData["qualityDisp"] = qualityDisp;
    qualityData["qualityVal"] = qualityVal;
    return qualityData;
}

function getChefSkillAddition(recipe, chef, ingredients) {
    var skillAddition = 0;

    if (chef.hasOwnProperty('skill')) {
        for (k in chef.skill) {
            var hasSkill = false;
            if (chef.skill[k].type.indexOf("水产") >= 0) {
                for (m in recipe.ingredient) {
                    for (n in ingredients) {
                        if (recipe.ingredient[m].name == ingredients[n].name) {
                            if (ingredients[n].originId == 8) {
                                hasSkill = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (chef.skill[k].type.indexOf("面") >= 0) {
                for (m in recipe.ingredient) {
                    for (n in ingredients) {
                        if (recipe.ingredient[m].name == ingredients[n].name) {
                            if (ingredients[n].originId == 1) {
                                hasSkill = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (chef.skill[k].type.indexOf("肉") >= 0) {
                for (m in recipe.ingredient) {
                    for (n in ingredients) {
                        if (recipe.ingredient[m].name == ingredients[n].name) {
                            if (ingredients[n].originId == 2
                                || ingredients[n].originId == 3
                                || ingredients[n].originId == 4) {
                                hasSkill = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (chef.skill[k].type.indexOf("蔬菜") >= 0) {
                for (m in recipe.ingredient) {
                    for (n in ingredients) {
                        if (recipe.ingredient[m].name == ingredients[n].name) {
                            if (ingredients[n].originId == 5
                                || ingredients[n].originId == 6
                                || ingredients[n].originId == 7) {
                                hasSkill = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (chef.skill[k].type.indexOf("炒") >= 0) {
                if (recipe.stirfry > 0) {
                    hasSkill = true;
                }
            }
            if (chef.skill[k].type.indexOf("煮") >= 0) {
                if (recipe.boil > 0) {
                    hasSkill = true;
                }
            }
            if (chef.skill[k].type.indexOf("炸") >= 0) {
                if (recipe.fry > 0) {
                    hasSkill = true;
                }
            }
            if (chef.skill[k].type.indexOf("切") >= 0) {
                if (recipe.cut > 0) {
                    hasSkill = true;
                }
            }
            if (chef.skill[k].type.indexOf("烤") >= 0) {
                if (recipe.roast > 0) {
                    hasSkill = true;
                }
            }
            if (chef.skill[k].type.indexOf("蒸") >= 0) {
                if (recipe.steam > 0) {
                    hasSkill = true;
                }
            }
            if (chef.skill[k].type.indexOf("金币") >= 0) {
                hasSkill = true;
            }

            if (hasSkill) {
                skillAddition += chef.skill[k].addition;
            }
        }
    }

    return skillAddition;
}

function initRecipeShow(recipeTable, data, private) {
    recipeTable.column(0).visible($('#chk-recipe-show-id').prop("checked"), false);
    recipeTable.column(2).visible($('#chk-recipe-show-fire').prop("checked"), false);

    var chkSkill = $('#chk-recipe-show-skill').prop("checked");
    recipeTable.column(3).visible(chkSkill, false);
    recipeTable.column(4).visible(chkSkill, false);
    recipeTable.column(5).visible(chkSkill, false);
    recipeTable.column(6).visible(chkSkill, false);
    recipeTable.column(7).visible(chkSkill, false);
    recipeTable.column(8).visible(chkSkill, false);
    recipeTable.column(9).visible($('#chk-recipe-show-ingredient').prop("checked"), false);
    recipeTable.column(10).visible($('#chk-recipe-show-price').prop("checked"), false);
    recipeTable.column(11).visible($('#chk-recipe-show-time').prop("checked"), false);
    recipeTable.column(12).visible($('#chk-recipe-show-total').prop("checked"), false);
    recipeTable.column(13).visible($('#chk-recipe-show-total-price').prop("checked"), false);
    recipeTable.column(14).visible($('#chk-recipe-show-total-time').prop("checked"), false);
    recipeTable.column(15).visible($('#chk-recipe-show-efficiency').prop("checked"), false);
    recipeTable.column(16).visible($('#chk-recipe-show-ingredient-efficiency').prop("checked"), false);
    recipeTable.column(17).visible($('#chk-recipe-show-origin').prop("checked"), false);
    recipeTable.column(18).visible($('#chk-recipe-show-unlock').prop("checked"), false);
    recipeTable.column(19).visible($('#chk-recipe-show-guest').prop("checked"), false);
    recipeTable.column(20).visible($('#chk-recipe-show-level-guest').prop("checked"), false);
    recipeTable.column(21).visible($('#chk-recipe-show-god-rune').prop("checked"), false);

    if (private) {
        recipeTable.column(22).visible($('#chk-recipe-show-get').prop("checked"), false);
        recipeTable.column(23).visible($('#chk-recipe-show-quality').prop("checked"), false);
        recipeTable.column(24).visible($('#chk-recipe-show-remark').prop("checked"), false);
    } else {
        recipeTable.column(22).visible(false, false);
        recipeTable.column(23).visible(false, false);
        recipeTable.column(24).visible(false, false);
    }

    var chkChefs = $('#chk-recipe-show-chef').val();
    for (j = 0; j < data.chefs.length; j++) {
        recipeTable.column(25 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
        recipeTable.column(26 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
    }

    recipeTable.columns.adjust().draw(false);
}

function initChefShow(chefTable, data, private) {
    chefTable.column(0).visible($('#chk-chef-show-id').prop("checked"), false);
    chefTable.column(2).visible($('#chk-chef-show-fire').prop("checked"), false);

    var chkSkill = $('#chk-chef-show-skill').prop("checked");
    chefTable.column(3).visible(chkSkill, false);
    chefTable.column(4).visible(chkSkill, false);
    chefTable.column(5).visible(chkSkill, false);
    chefTable.column(6).visible(chkSkill, false);
    chefTable.column(7).visible(chkSkill, false);
    chefTable.column(8).visible(chkSkill, false);
    chefTable.column(9).visible($('#chk-chef-show-special-skill').prop("checked"), false);
    var chkHarvest = $('#chk-chef-show-harvest').prop("checked");
    chefTable.column(10).visible(chkHarvest, false);
    chefTable.column(11).visible(chkHarvest, false);
    chefTable.column(12).visible(chkHarvest, false);
    chefTable.column(13).visible(chkHarvest, false);
    chefTable.column(14).visible($('#chk-chef-show-sex').prop("checked"), false);
    chefTable.column(15).visible($('#chk-chef-show-origin').prop("checked"), false);

    var chkRecipes = $('#chk-chef-show-recipe').val();
    for (j = 0; j < data.recipes.length; j++) {
        chefTable.column(16 + j).visible(chkRecipes.indexOf(j.toString()) > -1, false);
    }

    chefTable.columns.adjust().draw(false);
}

function initInfo(data, private) {
    $('#pagination-history').pagination({
        dataSource: data.history,
        callback: function (data, pagination) {
            var html = historyTemplate(data);
            $('#data-history').html(html);
        },
        pageSize: 5,
        showPageNumbers: false,
        showNavigator: true,
        showPrevious: true,
        showNext: true
    });

    $('#chk-function-switch').change(function () {
        if ($(this).prop("checked")) {
            $('.main-function').addClass("hidden");
            $('#main-chef').removeClass("hidden");
        } else {
            $('.main-function').addClass("hidden");
            $('#main-recipe').removeClass("hidden");
        }
    });
}

function historyTemplate(data) {
    var html = '';
    $.each(data, function (index, item) {
        html += '<p>' + item + '</p>';
    });
    return html;
}

function secondsToTime(sec) {
    sec = Number(sec);

    var d = Math.floor(sec / 3600 / 24);
    var h = Math.floor(sec / 3600 % 24);
    var m = Math.floor(sec / 60 % 60);
    var s = Math.floor(sec % 60);

    var ret = "";
    if (d > 0) {
        ret += d + "天";
    }
    if (h > 0) {
        ret += h + "小时";
    }
    if (m > 0) {
        ret += m + "分";
    }
    if (s > 0) {
        ret += s + "秒";
    }

    return ret;
}
