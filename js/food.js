$(function () {
    $.ajax({
        cache: false,
        success: function (json) {
            init(json);
        },
        url: 'data/data.json'
    });
});

var private = false;
function init(json) {

    if (window.location.search) {
        if (lcode(window.location.search) == "0d9753e2fe5a15db2668f70016e565ca7d717c67278ea6c689881ac4") {
            private = true;
        }
    }

    var person;
    try {
        var localData = localStorage.getItem('data');
        person = JSON.parse(localData);
    } catch (e) { }

    if (private) {
        $.ajax({
            cache: false,
            success: function (json2) {
                var data = generateData(json, json2, person);
                initTables(data, person);
            },
            error: function () {
                var data = generateData(json, null, person);
                initTables(data, person);
            },
            url: 'data/data2.json'
        });
    } else {
        var data = generateData(json, null, person);
        initTables(data, person);
    }

}

function initTables(data, person) {

    updateMenu(data, person);

    initRecipeTable(data);

    initChefTable(data);

    initEquipTable(data);

    initQuestTable(data);

    initImportExport(data);

    if (private) {
        initCalTables(data);
        $(".nav-tabs li").removeClass("hidden");
    }

    initInfo(data);

    $('.loading').addClass("hidden");
    $('.main-function').removeClass("hidden");
}


function initRecipeTable(data) {
    var recipeColumns = [
        {
            "data": "recipeId"
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": "stirfry"
        },
        {
            "data": "boil"
        },
        {
            "data": "knife"
        },
        {
            "data": "fry"
        },
        {
            "data": "bake"
        },
        {
            "data": "steam"
        },
        {
            "data": {
                "_": "materialsVal",
                "display": "materialsDisp"
            }
        },
        {
            "data": "price"
        },
        {
            "data": {
                "_": "time",
                "display": "timeDisp"
            }
        },
        {
            "data": "limitVal"
        },
        {
            "data": "totalPrice"
        },
        {
            "data": {
                "_": "totalTime",
                "display": "totalTimeDisp"
            }
        },
        {
            "data": "efficiency"
        },
        {
            "data": "materialsEff"
        },
        {
            "data": "origin"
        },
        {
            "data": "unlock"
        },
        {
            "data": "tagsDisp",
            "defaultContent": ""
        },
        {
            "data": "guestsDisp"
        },
        {
            "data": {
                "_": "rankGuestsVal",
                "display": "rankGuestsDisp"
            }
        },
        {
            "data": "godAntiqueDisp"
        },
        {
            "data": "rank",
            "width": "31px"
        },
        {
            "data": "got",
            "width": "31px"
        }
    ];

    for (var j in data.chefs) {
        $('#chk-recipe-show-chef').append("<option value='" + j + "'>" + data.chefs[j].name + "</option>");
        $('#recipe-table thead tr').append("<th>" + data.chefs[j].name + "</th>").append("<th>效率</th>");

        recipeColumns.push({
            "data": {
                "_": "chefs." + j + ".rankVal",
                "display": "chefs." + j + ".rankDisp"
            }
        });
        recipeColumns.push({
            "data": "chefs." + j + ".efficiency"
        });
    }

    var recipeTable = $('#recipe-table').DataTable({
        data: data.recipes,
        columns: recipeColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "第 _PAGE_ 页 共 _PAGES_ 页 _TOTAL_ 个菜谱",
            infoEmpty: "没有数据",
            infoFiltered: "(从 _MAX_ 个菜谱中过滤)"
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        deferRender: true,
        order: [],
        autoWidth: false
    });

    $("#pane-recipes div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="菜名 材料 贵客 符文 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('recipe-table')) {
            return true;
        }

        var chkRarity1 = $('#chk-recipe-rarity-1').prop("checked");
        var chkRarity2 = $('#chk-recipe-rarity-2').prop("checked");
        var chkRarity3 = $('#chk-recipe-rarity-3').prop("checked");
        var chkRarity4 = $('#chk-recipe-rarity-4').prop("checked");
        var chkRarity5 = $('#chk-recipe-rarity-5').prop("checked");
        var rarity = Math.floor(data[2]) || 0;

        if (chkRarity1 && rarity == 1
            || chkRarity2 && rarity == 2
            || chkRarity3 && rarity == 3
            || chkRarity4 && rarity == 4
            || chkRarity5 && rarity == 5) {
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

        if ($('#chk-recipe-skill-stirfry').prop("checked") && (Math.floor(data[3]) || 0) > 0
            || $('#chk-recipe-skill-boil').prop("checked") && (Math.floor(data[4]) || 0) > 0
            || $('#chk-recipe-skill-knife').prop("checked") && (Math.floor(data[5]) || 0) > 0
            || $('#chk-recipe-skill-fry').prop("checked") && (Math.floor(data[6]) || 0) > 0
            || $('#chk-recipe-skill-bake').prop("checked") && (Math.floor(data[7]) || 0) > 0
            || $('#chk-recipe-skill-steam').prop("checked") && (Math.floor(data[8]) || 0) > 0
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

        var min = Math.floor($('#input-recipe-price').val());
        var price = Math.floor(data[10]) || 0;

        if ($('#input-recipe-price').val() == "" || min < price) {
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
        var guest = data[20];

        if (!check || check && guest) {
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

        var check = $('#chk-recipe-no-origin').prop("checked");
        var origin = data[17];   // origin

        if (check || !check && origin) {
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

        var value = $("#input-recipe-guest-antique").val();
        var searchCols = [21, 22];  // rank guest, rank antique

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

        var check = $('#chk-recipe-got').prop("checked");
        var got = data[24];   // got

        if (!check || check && got) {
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

        var value = $("#pane-recipes .search-box input").val();
        var searchCols = [0, 1, 9, 17, 19, 20]; // id, name, materials, origin, tags, guest

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                if (searchCols[i] == 17) {  // origin
                    if (data[searchCols[i]].indexOf("神级") !== -1) {
                        continue;
                    }
                }
                return true;
            }
        }

        return false;
    });

    var rankOptions = getRankOptions();
    var gotOptions = getGotOptions();
    recipeTable.MakeCellsEditable({
        "columns": [23, 24],  // rank, got
        "inputTypes": [
            {
                "column": 23,
                "type": "list",
                "options": rankOptions
            },
            {
                "column": 24,
                "type": "list",
                "options": gotOptions
            }
        ],
        "onUpdate": function (table, row, cell, oldValue) {
            var recipe = row.data();
            var rankGuestInfo = getRankGuestInfo(recipe, recipe.rank, data.guests);
            recipe.rankGuestsVal = rankGuestInfo.rankGuestsVal;
            recipe.rankGuestsDisp = rankGuestInfo.rankGuestsDisp;
            $(table.cell(row.index(), 21).node()).html(recipe.rankGuestsDisp);  // rank guest

            updateRecipesLocalData();
        }
    });

    $('#chk-recipe-show-chef').selectpicker().on('changed.bs.select', function () {
        initRecipeShow(recipeTable, data);
    });

    $('.chk-recipe-show').click(function () {
        initRecipeShow(recipeTable, data);
        updateMenuLocalData();
    });

    $('#chk-recipe-show-all').click(function () {
        if ($('.btn:not(.hidden) .chk-recipe-show:checked').length == $('.btn:not(.hidden) .chk-recipe-show').length) {
            $('.btn:not(.hidden) .chk-recipe-show').prop("checked", false);
        }
        else {
            $('.btn:not(.hidden) .chk-recipe-show').prop("checked", true);
        }
        initRecipeShow(recipeTable, data);
        updateMenuLocalData();
    });

    $('.chk-recipe-rarity input[type="checkbox"]').click(function () {
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

    $('#input-recipe-guest-antique').keyup(function () {
        if (!$('#chk-recipe-show-rank-guest').prop("checked")) {
            $('#chk-recipe-show-rank-guest').prop("checked", true);
            initRecipeShow(recipeTable, data);
        }
        recipeTable.draw();
    });

    $('#chk-recipe-guest').click(function () {
        recipeTable.draw();
    });

    $('#chk-recipe-filter-guest').click(function () {
        recipeTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var recipe = this.data();
            var rankGuestInfo = getRankGuestInfo(recipe, recipe.rank, data.guests);
            recipe.rankGuestsVal = rankGuestInfo.rankGuestsVal;
            recipe.rankGuestsDisp = rankGuestInfo.rankGuestsDisp;
            this.data(recipe);
        });

        recipeTable.draw();
    });

    $('#chk-recipe-got').click(function () {
        recipeTable.draw();
    });

    $('#chk-recipe-no-origin').click(function () {
        recipeTable.draw();
    });

    $('#pane-recipes .search-box input').keyup(function () {
        recipeTable.draw();
    });

    if (private) {
        $('#chk-recipe-show-origin').prop("checked", false);
        $('#chk-recipe-show-unlock').prop("checked", false);
        $('#chk-recipe-show-tags').parent(".btn").removeClass('hidden');
        $('#chk-recipe-no-origin').closest(".box").removeClass('hidden');
    }

    initRecipeShow(recipeTable, data);
}

function initChefTable(data) {
    var chefColumns = [
        {
            "data": {
                "_": "chefId",
                "display": "chefIdDisp"
            }
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": {
                "_": "stirfryVal",
                "display": "stirfryDisp"
            }
        },
        {
            "data": {
                "_": "boilVal",
                "display": "boilDisp"
            }
        },
        {
            "data": {
                "_": "knifeVal",
                "display": "knifeDisp"
            }
        },
        {
            "data": {
                "_": "fryVal",
                "display": "fryDisp"
            }
        },
        {
            "data": {
                "_": "bakeVal",
                "display": "bakeDisp"
            }
        },
        {
            "data": {
                "_": "steamVal",
                "display": "steamDisp"
            }
        },
        {
            "data": "specialSkillDisp"
        },
        {
            "data": "meat"
        },
        {
            "data": "creation"
        },
        {
            "data": "veg"
        },
        {
            "data": "fish"
        },
        {
            "data": "gender"
        },
        {
            "data": "origin"
        },
        {
            "data": "tagsDisp",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "equipName",
                "display": "equipDisp"
            }
        },
        {
            "data": "ultimateGoal"
        },
        {
            "data": "ultimateSkillDisp"
        },
        {
            "data": "ultimate",
            "width": "31px"
        },
        {
            "data": "got",
            "width": "31px"
        }
    ];

    for (var j in data.recipes) {
        $('#chk-chef-show-recipe').append("<option value='" + j + "'>" + data.recipes[j].name + "</option>");
        $('#chef-table thead tr').append("<th title='" + data.recipes[j].skillDisp + "'>" + data.recipes[j].name + "</th>").append("<th>效率</th>");

        chefColumns.push({
            "data": {
                "_": "recipes." + j + ".rankVal",
                "display": "recipes." + j + ".rankDisp"
            }
        });
        chefColumns.push({
            "data": "recipes." + j + ".efficiency"
        });
    }

    var chefTable = $('#chef-table').DataTable({
        data: data.chefs,
        columns: chefColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "第 _PAGE_ 页 共 _PAGES_ 页 _TOTAL_ 个厨师",
            infoEmpty: "没有数据",
            infoFiltered: "(从 _MAX_ 个厨师中过滤)"
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        deferRender: true,
        order: [],
        autoWidth: false
    });

    $("#pane-chefs div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 技能 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('chef-table')) {
            return true;
        }

        var chkRarity1 = $('#chk-chef-rarity-1').prop("checked");
        var chkRarity2 = $('#chk-chef-rarity-2').prop("checked");
        var chkRarity3 = $('#chk-chef-rarity-3').prop("checked");
        var chkRarity4 = $('#chk-chef-rarity-4').prop("checked");
        var chkRarity5 = $('#chk-chef-rarity-5').prop("checked");
        var rarity = Math.floor(data[2]) || 0;

        if (chkRarity1 && rarity == 1
            || chkRarity2 && rarity == 2
            || chkRarity3 && rarity == 3
            || chkRarity4 && rarity == 4
            || chkRarity5 && rarity == 5) {
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

        var stirfryMin = Math.floor($('#input-chef-stirfry').val());
        var stirfry = Math.floor(data[3]) || 0;
        var boilMin = Math.floor($('#input-chef-boil').val());
        var boil = Math.floor(data[4]) || 0;
        var knifeMin = Math.floor($('#input-chef-knife').val());
        var knife = Math.floor(data[5]) || 0;
        var fryMin = Math.floor($('#input-chef-fry').val());
        var fry = Math.floor(data[6]) || 0;
        var bakeMin = Math.floor($('#input-chef-bake').val());
        var bake = Math.floor(data[7]) || 0;
        var steamMin = Math.floor($('#input-chef-steam').val());
        var steam = Math.floor(data[8]) || 0;

        if (stirfryMin <= stirfry && boilMin <= boil && knifeMin <= knife && fryMin <= fry && bakeMin <= bake && steamMin <= steam) {
            return true;
        } else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('chef-table')) {
            return true;
        }

        var chkMale = $('#chk-chef-gender-male').prop("checked");
        var chkFemale = $('#chk-chef-gender-female').prop("checked");
        var gender = data[14];

        if (chkMale && gender == "男" || chkFemale && gender == "女") {
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

        var check = $('#chk-chef-no-origin').prop("checked");
        var origin = data[15];   // origin

        if (check || !check && origin) {
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

        var check = $('#chk-chef-got').prop("checked");
        var got = data[21];   // got

        if (!check || check && got) {
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

        var value = $("#pane-chefs .search-box input").val();
        var searchCols = [1, 9, 15, 16, 19];    //  name, skill, origin, tags, ultimateskill

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    var gotOptions = getGotOptions();
    var equipsOptions = getEquipsOptions(data.equips, data.skills);

    chefTable.MakeCellsEditable({
        "columns": [17, 20, 21],  // equipName, ultimate, got
        "inputTypes": [
            {
                "column": 17,
                "type": "list",
                "search": true,
                "options": equipsOptions
            },
            {
                "column": 20,
                "type": "list",
                "options": gotOptions
            },
            {
                "column": 21,
                "type": "list",
                "options": gotOptions
            }
        ],
        "onUpdate": function (table, row, cell, oldValue) {
            if (cell.index().column == 17) {     // equipName
                var chef = row.data();
                var equip = null;
                var equipDisp = "";
                if (chef.equipName) {
                    for (var j in data.equips) {
                        if (chef.equipName == data.equips[j].name) {
                            equip = data.equips[j];
                            equipDisp = data.equips[j].name + "<br>" + data.equips[j].skillDisp;
                            break;
                        }
                    }
                }
                chef.equip = equip;
                chef.equipDisp = equipDisp;
                $(cell.node()).html(equipDisp);
            }
            if ((cell.index().column == 17 || cell.index().column == 20) && cell.data() != oldValue) {   // equipName, ultimate
                $("#btn-chef-recal").removeClass("btn-default").addClass("btn-danger");
            }
            updateChefsLocalData();
        }
    });

    $('#chk-chef-show-recipe').selectpicker().on('changed.bs.select', function () {
        initChefShow(chefTable, data);
    });

    $('.chk-chef-show').click(function () {
        initChefShow(chefTable, data);
        updateMenuLocalData();
    });

    $('#chk-chef-show-all').click(function () {
        if ($('.chk-chef-show:checked').length == $('.chk-chef-show').length) {
            $('.chk-chef-show').prop("checked", false);
        }
        else {
            $('.chk-chef-show').prop("checked", true);
        }
        initChefShow(chefTable, data);
        updateMenuLocalData();
    });

    $('.chk-chef-rarity input[type="checkbox"]').click(function () {
        chefTable.draw();
    });

    $('.input-chef-skill').keyup(function () {
        chefTable.draw();
    });

    $('#btn-chef-skill-clear').click(function () {
        $('.input-chef-skill').val("");
        chefTable.draw();
    });

    $('.chk-chef-gender input[type="checkbox"]').click(function () {
        chefTable.draw();
    });

    $('#chk-chef-got').click(function () {
        chefTable.draw();
    });

    $('#chk-chef-no-origin').click(function () {
        chefTable.draw();
    });

    $('#pane-chefs .search-box input').keyup(function () {
        chefTable.draw();
    });

    $('#chk-chef-apply-ultimate').change(function () {
        if ($(this).prop("checked")) {
            $('.chef-apply-ultimate').show();
        } else {
            $('.chef-apply-ultimate').hide();
        }
        updateRecipeChefTable(data);
    });

    $('#chk-chef-apply-ultimate-person').change(function () {
        updateRecipeChefTable(data);
    });

    $('#chk-chef-apply-equips').change(function () {
        updateRecipeChefTable(data);
    });

    $('#btn-chef-recal').click(function () {
        updateRecipeChefTable(data);
    });

    if (private) {
        $('#chk-chef-show-tags').parent(".btn").removeClass('hidden');
        $('#chk-chef-no-origin').closest(".box").removeClass('hidden');
    }

    initChefShow(chefTable, data);
}

function initEquipTable(data) {
    var equipColumns = [
        {
            "data": "equipId"
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": "skillDisp"
        },
        {
            "data": "origin"
        }
    ];

    var equipTable = $('#equip-table').DataTable({
        data: data.equips,
        columns: equipColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "第 _PAGE_ 页 共 _PAGES_ 页 _TOTAL_ 个厨具",
            infoEmpty: "没有数据",
            infoFiltered: "(从 _MAX_ 个厨具中过滤)"
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        deferRender: true
    });

    $("#pane-equips div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 技能 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('equip-table')) {
            return true;
        }

        var skill = data[3];    // skill

        if ($('#chk-equip-skill-stirfry-price').prop("checked") && skill.indexOf("炒类料理售价") >= 0
            || $('#chk-equip-skill-boil-price').prop("checked") && skill.indexOf("煮类料理售价") >= 0
            || $('#chk-equip-skill-knife-price').prop("checked") && skill.indexOf("切类料理售价") >= 0
            || $('#chk-equip-skill-fry-price').prop("checked") && skill.indexOf("炸类料理售价") >= 0
            || $('#chk-equip-skill-bake-price').prop("checked") && skill.indexOf("烤类料理售价") >= 0
            || $('#chk-equip-skill-steam-price').prop("checked") && skill.indexOf("蒸类料理售价") >= 0
            || $('#chk-equip-skill-meat-price').prop("checked") && skill.indexOf("肉类料理售价") >= 0
            || $('#chk-equip-skill-creation-price').prop("checked") && skill.indexOf("面类料理售价") >= 0
            || $('#chk-equip-skill-veg-price').prop("checked") && skill.indexOf("蔬菜料理售价") >= 0
            || $('#chk-equip-skill-fish-price').prop("checked") && skill.indexOf("水产料理售价") >= 0
            || $('#chk-equip-skill-sell-price').prop("checked") && (skill.indexOf("金币获得") >= 0 || skill.indexOf("营业收入") >= 0)
            || $('#chk-equip-skill-stirfry-skill').prop("checked") && skill.indexOf("炒技法") >= 0
            || $('#chk-equip-skill-boil-skill').prop("checked") && skill.indexOf("煮技法") >= 0
            || $('#chk-equip-skill-knife-skill').prop("checked") && skill.indexOf("切技法") >= 0
            || $('#chk-equip-skill-fry-skill').prop("checked") && skill.indexOf("炸技法") >= 0
            || $('#chk-equip-skill-bake-skill').prop("checked") && skill.indexOf("烤技法") >= 0
            || $('#chk-equip-skill-steam-skill').prop("checked") && skill.indexOf("蒸技法") >= 0
            || $('#chk-equip-skill-all-skill').prop("checked") && skill.indexOf("全技法") >= 0
            || $('#chk-equip-skill-guest').prop("checked") && skill.indexOf("稀有客人") >= 0
            || $('#chk-equip-skill-time').prop("checked") && skill.indexOf("开业时间") >= 0
            || $('#chk-equip-skill-material-get').prop("checked") && skill.indexOf("素材获得") >= 0
            || $('#chk-equip-skill-meat-skill').prop("checked") && skill.indexOf("肉类采集") >= 0
            || $('#chk-equip-skill-creation-skill').prop("checked") && skill.indexOf("面类采集") >= 0
            || $('#chk-equip-skill-veg-skill').prop("checked") && skill.indexOf("蔬菜采集") >= 0
            || $('#chk-equip-skill-fish-skill').prop("checked") && skill.indexOf("水产采集") >= 0
            || $('#chk-equip-skill-material-skill').prop("checked") && skill.indexOf("全采集") >= 0
        ) {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('equip-table')) {
            return true;
        }

        var check = $('#chk-equip-no-origin').prop("checked");
        var origin = data[4];   // origin

        if (check || !check && origin) {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('equip-table')) {
            return true;
        }

        var value = $("#pane-equips .search-box input").val();
        var searchCols = [1, 3, 4];    // name, skill, origin

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('.chk-equip-show').click(function () {
        initEquipShow(equipTable);
    });

    $('#chk-equip-show-all').click(function () {
        if ($('.chk-equip-show:checked').length == $('.chk-equip-show').length) {
            $('.chk-equip-show').prop("checked", false);
        }
        else {
            $('.chk-equip-show').prop("checked", true);
        }
        initEquipShow(equipTable);
    });

    $('.chk-equip-skill').click(function () {
        if ($(this).prop("checked")) {
            if ($('#chk-equip-single-skill').prop("checked")) {
                $(".chk-equip-skill").not(this).prop("checked", false);
            }
        }
        equipTable.draw();
    });

    $('#chk-equip-single-skill').change(function () {
        if ($(this).prop("checked")) {
            if ($('.chk-equip-skill:checked').length > 1) {
                $('.chk-equip-skill').prop("checked", false);
                equipTable.draw();
            }
        }
    });

    $('#chk-equip-skill-all').click(function () {
        if ($('#chk-equip-single-skill').prop("checked")) {
            $('#chk-equip-single-skill').bootstrapToggle('off')
        }
        $(".chk-equip-skill").prop("checked", true);
        equipTable.draw();
    });

    $('#chk-equip-no-origin').click(function () {
        equipTable.draw();
    });

    $('#pane-equips .search-box input').keyup(function () {
        equipTable.draw();
    });

    if (private) {
        $('#chk-equip-no-origin').closest(".box").removeClass('hidden');
    }

    initEquipShow(equipTable);
}

function initQuestTable(data) {
    var questColumns = [
        {
            "data": "questId"
        },
        {
            "data": "goal"
        },
        {
            "data": {
                "_": "rewardsVal",
                "display": "rewardsDisp"
            }
        }
    ];

    var questsData = getQuestsData(data.quests, $('#select-quest-type').val());

    var questTable = $('#quest-table').DataTable({
        data: questsData,
        columns: questColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "第 _PAGE_ 页 共 _PAGES_ 页 _TOTAL_ 个任务",
            infoEmpty: "没有数据",
            infoFiltered: "(从 _MAX_ 个任务中过滤)"
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        deferRender: true
    });

    $("#pane-quest div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="编号 任务 奖励"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('quest-table')) {
            return true;
        }

        var value = $("#pane-quest .search-box input").val();
        var searchCols = [0, 1, 2];    // questId, goal, rewards

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('#pane-quest .search-box input').keyup(function () {
        questTable.draw();
    });

    $('#select-quest-type').change(function () {
        var questsData = getQuestsData(data.quests, $(this).val());
        questTable.clear().rows.add(questsData).draw();
    });
}

function initImportExport(data) {
    $('#btn-export').click(function () {
        $("#input-export-import").val(generateExportData());
    });
    $('#btn-import').click(function () {
        $(this).prop("disabled", true);
        var success = importData(data, $("#input-export-import").val());
        if (success) {
            $("#input-export-import").val("");
        } else {
            alert("格式有误");
        }
        $(this).prop("disabled", false);
    });
}

function importData(data, input) {
    var person;
    try {
        person = JSON.parse(input);
    } catch (e) {
        return false;
    }

    for (var i in data.recipes) {
        for (var j in person.recipes) {
            if (data.recipes[i].recipeId == person.recipes[j].id) {
                if (person.recipes[j].hasOwnProperty("rank")) {
                    data.recipes[i].rank = person.recipes[j].rank;
                    var rankGuestInfo = getRankGuestInfo(data.recipes[i], data.recipes[i].rank, data.guests);
                    data.recipes[i].rankGuestsVal = rankGuestInfo.rankGuestsVal;
                    data.recipes[i].rankGuestsDisp = rankGuestInfo.rankGuestsDisp;
                }
                if (person.recipes[j].hasOwnProperty("got")) {
                    data.recipes[i].got = person.recipes[j].got;
                }
                break;
            }
        }
    }

    for (var i in data.chefs) {
        for (var j in person.chefs) {
            if (data.chefs[i].chefId == person.chefs[j].id) {
                if (person.chefs[j].hasOwnProperty("got")) {
                    data.chefs[i].got = person.chefs[j].got;
                }
                if (person.chefs[j].hasOwnProperty("ult")) {
                    data.chefs[i].ultimate = person.chefs[j].ult;
                }
                if (person.chefs[j].hasOwnProperty("equip")) {
                    for (var k in data.equips) {
                        if (person.chefs[j].equip == data.equips[k].equipId) {
                            data.chefs[i].equip = data.equips[k];
                            data.chefs[i].equipName = data.equips[k].name;
                            data.chefs[i].equipDisp = data.equips[k].name + "<br>" + data.equips[k].skillDisp;
                            break;
                        }
                    }
                } else {
                    data.chefs[i].equip = null;
                }
                break;
            }
        }
    }

    updateMenu(data, person);

    try {
        localStorage.setItem('data', generateExportData());
    } catch (e) { }

    data = getUpdateData(data);

    $('#recipe-table').DataTable().clear().rows.add(data.recipes).draw();
    $('#chef-table').DataTable().clear().rows.add(data.chefs).draw();
    initRecipeShow($('#recipe-table').DataTable(), data);
    initChefShow($('#chef-table').DataTable(), data);

    $("#btn-chef-recal").removeClass("btn-danger").addClass("btn-default");

    return true;
}

function updateRecipesLocalData() {
    var person;
    try {
        var localData = localStorage.getItem('data');
        person = JSON.parse(localData);
    } catch (e) { }

    if (!person) {
        person = new Object();
    }

    person["recipes"] = generateRecipesExportData();

    try {
        localStorage.setItem('data', JSON.stringify(person));
    } catch (e) { }
}

function updateChefsLocalData() {
    var person;
    try {
        var localData = localStorage.getItem('data');
        person = JSON.parse(localData);
    } catch (e) { }

    if (!person) {
        person = new Object();
    }

    person["chefs"] = generateChefsExportData();

    try {
        localStorage.setItem('data', JSON.stringify(person));
    } catch (e) { }
}

function updateMenuLocalData() {
    var person;
    try {
        var localData = localStorage.getItem('data');
        person = JSON.parse(localData);
    } catch (e) { }

    if (!person) {
        person = new Object();
    }

    person["menu"] = generateMenuExportData();

    try {
        localStorage.setItem('data', JSON.stringify(person));
    } catch (e) { }
}

function generateExportData() {
    var exportData = new Object();
    exportData["recipes"] = generateRecipesExportData();
    exportData["chefs"] = generateChefsExportData();
    exportData["menu"] = generateMenuExportData();
    return JSON.stringify(exportData);
}

function generateRecipesExportData() {
    var exportRecipes = new Array();
    var recipes = $('#recipe-table').DataTable().data().toArray();
    for (var i in recipes) {
        var recipe = new Object();
        recipe["id"] = recipes[i].recipeId;
        recipe["rank"] = recipes[i].rank;
        recipe["got"] = recipes[i].got;
        exportRecipes.push(recipe);
    }
    return exportRecipes;
}

function generateChefsExportData() {
    var exportChefs = new Array();
    var chefs = $('#chef-table').DataTable().data().toArray();
    for (var i in chefs) {
        var chef = new Object();
        chef["id"] = chefs[i].chefId;
        chef["got"] = chefs[i].got;
        chef["ult"] = chefs[i].ultimate;
        if (chefs[i].equip) {
            chef["equip"] = chefs[i].equip.equipId;
        }
        exportChefs.push(chef);
    }
    return exportChefs;
}

function generateMenuExportData() {
    var exportData = new Object();

    var recipeMenu = new Object();
    recipeMenu["id"] = $("#chk-recipe-show-id").prop("checked");
    recipeMenu["rarity"] = $("#chk-recipe-show-rarity").prop("checked");
    recipeMenu["skill"] = $("#chk-recipe-show-skill").prop("checked");
    recipeMenu["materials"] = $("#chk-recipe-show-materials").prop("checked");
    recipeMenu["price"] = $("#chk-recipe-show-price").prop("checked");
    recipeMenu["time"] = $("#chk-recipe-show-time").prop("checked");
    recipeMenu["limit"] = $("#chk-recipe-show-limit").prop("checked");
    recipeMenu["totalPrice"] = $("#chk-recipe-show-total-price").prop("checked");
    recipeMenu["totalTime"] = $("#chk-recipe-show-total-time").prop("checked");
    recipeMenu["efficiency"] = $("#chk-recipe-show-efficiency").prop("checked");
    recipeMenu["materialsEfficiency"] = $("#chk-recipe-show-materials-efficiency").prop("checked");
    recipeMenu["origin"] = $("#chk-recipe-show-origin").prop("checked");
    recipeMenu["unlock"] = $("#chk-recipe-show-unlock").prop("checked");
    recipeMenu["tags"] = $("#chk-recipe-show-tags").prop("checked");
    recipeMenu["guest"] = $("#chk-recipe-show-guest").prop("checked");
    recipeMenu["rankGuest"] = $("#chk-recipe-show-rank-guest").prop("checked");
    recipeMenu["rankAntique"] = $("#chk-recipe-show-rank-antique").prop("checked");
    recipeMenu["rank"] = $("#chk-recipe-show-rank").prop("checked");
    recipeMenu["got"] = $("#chk-recipe-show-got").prop("checked");
    exportData["recipe"] = recipeMenu;

    var chefMenu = new Object();
    chefMenu["id"] = $("#chk-chef-show-id").prop("checked");
    chefMenu["rarity"] = $("#chk-chef-show-rarity").prop("checked");
    chefMenu["skill"] = $("#chk-chef-show-skill").prop("checked");
    chefMenu["chefSkill"] = $("#chk-chef-show-chef-skill").prop("checked");
    chefMenu["explore"] = $("#chk-chef-show-explore").prop("checked");
    chefMenu["gender"] = $("#chk-chef-show-gender").prop("checked");
    chefMenu["origin"] = $("#chk-chef-show-origin").prop("checked");
    chefMenu["tags"] = $("#chk-chef-show-tags").prop("checked");
    chefMenu["equip"] = $("#chk-chef-show-equip").prop("checked");
    chefMenu["ultimateGoal"] = $("#chk-chef-show-ultimate-goal").prop("checked");
    chefMenu["ultimateSkill"] = $("#chk-chef-show-ultimate-skill").prop("checked");
    chefMenu["ultimate"] = $("#chk-chef-show-ultimate").prop("checked");
    chefMenu["got"] = $("#chk-chef-show-got").prop("checked");
    exportData["chef"] = chefMenu;

    return exportData;
}

function updateMenu(data, person) {
    if (person && person.menu) {
        var recipeMenu = person.menu.recipe;
        if (recipeMenu) {
            $("#chk-recipe-show-id").prop("checked", recipeMenu.id || false);
            $("#chk-recipe-show-rarity").prop("checked", recipeMenu.rarity || false);
            $("#chk-recipe-show-skill").prop("checked", recipeMenu.skill || false);
            $("#chk-recipe-show-materials").prop("checked", recipeMenu.materials || false);
            $("#chk-recipe-show-price").prop("checked", recipeMenu.price || false);
            $("#chk-recipe-show-time").prop("checked", recipeMenu.time || false);
            $("#chk-recipe-show-limit").prop("checked", recipeMenu.limit || false);
            $("#chk-recipe-show-total-price").prop("checked", recipeMenu.totalPrice || false);
            $("#chk-recipe-show-total-time").prop("checked", recipeMenu.totalTime || false);
            $("#chk-recipe-show-efficiency").prop("checked", recipeMenu.efficiency || false);
            $("#chk-recipe-show-materials-efficiency").prop("checked", recipeMenu.materialsEfficiency || false);
            $("#chk-recipe-show-origin").prop("checked", recipeMenu.origin || false);
            $("#chk-recipe-show-unlock").prop("checked", recipeMenu.unlock || false);
            $("#chk-recipe-show-tags").prop("checked", recipeMenu.tags || false);
            $("#chk-recipe-show-guest").prop("checked", recipeMenu.guest || false);
            $("#chk-recipe-show-rank-guest").prop("checked", recipeMenu.rankGuest || false);
            $("#chk-recipe-show-rank-antique").prop("checked", recipeMenu.rankAntique || false);
            $("#chk-recipe-show-rank").prop("checked", recipeMenu.rank || false);
            $("#chk-recipe-show-got").prop("checked", recipeMenu.got || false);
        }

        var chefMenu = person.menu.chef;
        if (chefMenu) {
            $("#chk-chef-show-id").prop("checked", chefMenu.id || false);
            $("#chk-chef-show-rarity").prop("checked", chefMenu.rarity || false);
            $("#chk-chef-show-skill").prop("checked", chefMenu.skill || false);
            $("#chk-chef-show-chef-skill").prop("checked", chefMenu.chefSkill || false);
            $("#chk-chef-show-explore").prop("checked", chefMenu.explore || false);
            $("#chk-chef-show-gender").prop("checked", chefMenu.gender || false);
            $("#chk-chef-show-origin").prop("checked", chefMenu.origin || false);
            $("#chk-chef-show-tags").prop("checked", chefMenu.tags || false);
            $("#chk-chef-show-equip").prop("checked", chefMenu.equip || false);
            $("#chk-chef-show-ultimate-goal").prop("checked", chefMenu.ultimateGoal || false);
            $("#chk-chef-show-ultimate-skill").prop("checked", chefMenu.ultimateSkill || false);
            $("#chk-chef-show-ultimate").prop("checked", chefMenu.ultimate || false);
            $("#chk-chef-show-got").prop("checked", chefMenu.got || false);
        }
    }

}


function initCalTables(data) {

    initCalRules(data);
    initCalRecipesTable(data);
    initCalChefsTable(data);
    initCalEquipsTable(data);
    initCalMaterialsTable(data);

    initCalResultsTable(data);

    initCalSelfSelect(data);

    $.fn.dataTable.ext.order['dom-selected'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $(td).parent("tr").hasClass("selected") ? '1' : '0';
        });
    }

    $("#pane-cal-results-common").remove();

}

function initCalRules(data) {
    var worker = new Worker("js/cal.js");
    worker.onmessage = function (event) {
        $("#select-cal-rule").append(event.data);
    };

    worker.postMessage({
        "mode": "get-rules-options"
    });

    var ruleWorker;
    $("#btn-cal-rule-load").click(function () {
        var rule = Math.floor($("#select-cal-rule").val());
        if (!rule) {
            alert("请选择规则");
            return;
        }

        $("#input-rule-id").val(rule);

        $("#btn-cal-rule-load").prop("disabled", true);
        $("#pane-cal-rules .cal-results-progress").removeClass("hidden");

        if (typeof (ruleWorker) != "undefined") {
            ruleWorker.terminate();
            ruleWorker = undefined;
        }

        ruleWorker = new Worker("js/cal.js");
        ruleWorker.onmessage = function (event) {
            $('#cal-recipes-table').DataTable().clear().rows.add(event.data.recipes).draw();
            $('#cal-recipes-table').DataTable().rows().select();

            $('#cal-chefs-table').DataTable().clear().rows.add(event.data.chefs).draw();
            $('#cal-chefs-table').DataTable().rows().select();

            $('#cal-materials-table').DataTable().clear().rows.add(event.data.materials).draw();
            $('#cal-materials-table').DataTable().rows().select();

            $('#cal-equips-table').DataTable().clear().rows.add(event.data.equips).draw();
            $('#cal-equips-table').DataTable().rows().select();

            var customWorker;

            var chefsOptions = getChefsOptions(event.data.chefs);
            var recipesOptions = getRecipesOptions(event.data.recipes);
            var equipsOptions = getEquipsOptions(data.equips, data.skills);

            $('#cal-self-select-table').DataTable().MakeCellsEditable("destroy");

            $('#cal-self-select-table').DataTable().MakeCellsEditable({
                "columns": [1, 10, 20, 24],  // chef name, recipe name, quantity, equip
                "inputTypes": [
                    {
                        "column": 1,
                        "type": "list",
                        "search": true,
                        "options": chefsOptions
                    },
                    {
                        "column": 10,
                        "type": "list",
                        "search": true,
                        "options": recipesOptions
                    },
                    {
                        "column": 24,
                        "type": "list",
                        "search": true,
                        "options": equipsOptions
                    }
                ],
                "onUpdate": function (table, row, cell, oldValue) {

                    if (typeof (customWorker) != "undefined") {
                        customWorker.terminate();
                        customWorker = undefined;
                    }

                    customWorker = new Worker("js/cal.js");
                    customWorker.onmessage = function (cevent) {
                        table.clear().rows.add(cevent.data).draw();
                        table.rows().select();
                        $(table.body()).removeClass("processing");
                    }

                    var calRecipesData = $('#cal-recipes-table').DataTable().data().toArray();
                    var calChefsData = $('#cal-chefs-table').DataTable().data().toArray();
                    var calEquipsData = $('#cal-equips-table').DataTable().data().toArray();
                    var calMaterialsData = $('#cal-materials-table').DataTable().data().toArray();

                    var currentData = table.data().toArray();

                    customWorker.postMessage({
                        "mode": "custom",
                        "rule": rule,
                        "recipes": calRecipesData,
                        "chefs": calChefsData,
                        "equips": calEquipsData,
                        "materials": calMaterialsData,
                        "odata": data,
                        "custom": currentData
                    });
                },
                "waitUpdate": true
            });

            $("#pane-cal-rules .cal-results-progress").addClass("hidden");
            $("#btn-cal-rule-load").prop("disabled", false);
        };

        var useUltimate = $("#chk-chef-apply-ultimate").prop("checked");
        var usePerson = $("#chk-chef-apply-ultimate-person").prop("checked");
        var personData;
        try {
            var localData = localStorage.getItem('data');
            personData = JSON.parse(localData);
        } catch (e) { }

        ruleWorker.postMessage({
            "mode": "get-rules-data",
            "rule": rule,
            "odata": data,
            "useUltimate": useUltimate,
            "usePerson": usePerson,
            "person": personData
        });

    });
}

function initCalRecipesTable(data) {
    var calRecipesColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": "recipeId"
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": "stirfry"
        },
        {
            "data": "boil"
        },
        {
            "data": "knife"
        },
        {
            "data": "fry"
        },
        {
            "data": "bake"
        },
        {
            "data": "steam"
        },
        {
            "data": {
                "_": "materialsVal",
                "display": "materialsDisp"
            }
        },
        {
            "data": "price"
        },
        {
            "data": "limitVal"
        },
        {
            "data": "totalPrice"
        },
        {
            "data": "origin"
        },
        {
            "data": "tagsDisp",
            "defaultContent": ""
        },
        {
            "data": "addition",
            "className": "cal-td-input-addition",
            "width": "38px"
        }
    ];

    var calRecipesTable = $('#cal-recipes-table').DataTable({
        data: new Array(),
        columns: calRecipesColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "共 _MAX_ 个菜谱",
            infoEmpty: "没有数据",
            infoFiltered: "",
            select: {
                rows: {
                    _: "选择了 %d 个菜谱",
                    0: "选择了 %d 个菜谱",
                    1: "选择了 %d 个菜谱"
                }
            }
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        select: {
            style: 'multi',
            selector: 'td.select-checkbox'
        },
        autoWidth: false,
        createdRow: function (row, data, index) {
            $(row).addClass('rarity-' + data.rarity);
        }
    });

    $("#pane-cal-recipes div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="菜名 材料"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-recipes-table')) {
            return true;
        }

        var value = $("#pane-cal-recipes .search-box input").val();
        var searchCols = [2, 10, 15];    //name, materials, tags

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    calRecipesTable.MakeCellsEditable({
        "columns": [16]  // addition
    });

    $('.chk-cal-recipes-show').click(function () {
        initCalRecipesShow(calRecipesTable);
    });

    $('.chk-cal-recipes-rarity input[type="checkbox"]').click(function () {
        var rarity = $(this).attr("data-rarity");
        if ($(this).prop("checked")) {
            calRecipesTable.rows('.rarity-' + rarity).select();
        } else {
            calRecipesTable.rows('.rarity-' + rarity).deselect();
        }
    });

    $('#pane-cal-recipes .search-box input').keyup(function () {
        calRecipesTable.draw();
    });

    $('#btn-cal-recipes-select-all').click(function () {
        $('.chk-cal-recipes-rarity input[type="checkbox"]').prop("checked", true);
        calRecipesTable.rows().select();
    });

    $('#btn-cal-recipes-deselect-all').click(function () {
        $('.chk-cal-recipes-rarity input[type="checkbox"]').prop("checked", false);
        calRecipesTable.rows().deselect();
    });

    initCalRecipesShow(calRecipesTable);
}

function initCalChefsTable(data) {
    var calChefsColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": {
                "_": "chefId",
                "display": "chefIdDisp"
            }
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": {
                "_": "stirfryVal",
                "display": "stirfryDisp"
            }
        },
        {
            "data": {
                "_": "boilVal",
                "display": "boilDisp"
            }
        },
        {
            "data": {
                "_": "knifeVal",
                "display": "knifeDisp"
            }
        },
        {
            "data": {
                "_": "fryVal",
                "display": "fryDisp"
            }
        },
        {
            "data": {
                "_": "bakeVal",
                "display": "bakeDisp"
            }
        },
        {
            "data": {
                "_": "steamVal",
                "display": "steamDisp"
            }
        },
        {
            "data": "specialSkillDisp"
        },
        {
            "data": "gender"
        },
        {
            "data": "origin"
        },
        {
            "data": "tagsDisp",
            "defaultContent": ""
        },
        {
            "data": "addition",
            "className": "cal-td-input-addition",
            "width": "38px"
        },
        {
            "data": "equipName",
            "className": "cal-td-select-equip",
            "width": "101px"
        }
    ];

    var calChefsTable = $('#cal-chefs-table').DataTable({
        data: new Array(),
        columns: calChefsColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "共 _MAX_ 个厨师",
            infoEmpty: "没有数据",
            infoFiltered: "",
            select: {
                rows: {
                    _: "选择了 %d 个厨师",
                    0: "选择了 %d 个厨师",
                    1: "选择了 %d 个厨师"
                }
            }
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        select: {
            style: 'multi',
            selector: 'td.select-checkbox'
        },
        autoWidth: false,
        createdRow: function (row, data, index) {
            $(row).addClass('rarity-' + data.rarity);
        }
    });

    $("#pane-cal-chefs div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 性别"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-chefs-table')) {
            return true;
        }

        var value = $("#pane-cal-chefs .search-box input").val();
        var searchCols = [2, 11, 13];   //name, gender, tags

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    var options = getEquipsOptions(data.equips, data.skills);
    calChefsTable.MakeCellsEditable({
        "columns": [14, 15],  // addition, equip
        "inputTypes": [
            {
                "column": 15,   // equip
                "type": "list",
                "search": true,
                "options": options
            }
        ]
    });

    $('.chk-cal-chefs-show').click(function () {
        initCalChefsShow(calChefsTable);
    });

    $('.chk-cal-chefs-rarity input[type="checkbox"]').click(function () {
        var rarity = $(this).attr("data-rarity");
        if ($(this).prop("checked")) {
            calChefsTable.rows('.rarity-' + rarity).select();
        } else {
            calChefsTable.rows('.rarity-' + rarity).deselect();
        }
    });

    $("#btn-cal-chefs-equip-clear").click(function () {
        calChefsTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
            this.cell(rowIdx, '.cal-td-select-equip').data("");
        });
    });

    $('#pane-cal-chefs .search-box input').keyup(function () {
        calChefsTable.draw();
    });

    $('#btn-cal-chefs-select-all').click(function () {
        $('.chk-cal-chefs-rarity input[type="checkbox"]').prop("checked", true);
        calChefsTable.rows().select();
    });

    $('#btn-cal-chefs-deselect-all').click(function () {
        $('.chk-cal-chefs-rarity input[type="checkbox"]').prop("checked", false);
        calChefsTable.rows().deselect();
    });

    initCalChefsShow(calChefsTable);
}

function initCalEquipsTable(data) {
    var calEquipsColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": "equipId"
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": "skillDisp"
        },
        {
            "data": "origin"
        }
    ];

    var calEquipsTable = $('#cal-equips-table').DataTable({
        data: new Array(),
        columns: calEquipsColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "共 _MAX_ 个厨具",
            infoEmpty: "没有数据",
            infoFiltered: "",
            select: {
                rows: {
                    _: "选择了 %d 个厨具",
                    0: "选择了 %d 个厨具",
                    1: "选择了 %d 个厨具"
                }
            }
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        select: {
            style: 'multi',
            selector: 'td.select-checkbox'
        },
        order: [[4, "desc"]],  //origin
        autoWidth: false,
        createdRow: function (row, data, index) {
            $(row).addClass('rarity-' + data.rarity);
        }
    });

    $("#pane-cal-equips div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 技能 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-equips-table')) {
            return true;
        }

        var value = $("#pane-cal-equips .search-box input").val();
        var searchCols = [2, 4, 5];   // name, skill, origin

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('.chk-cal-equips-show').click(function () {
        initCalEquipsShow(calEquipsTable);
    });

    $('.chk-cal-equips-rarity input[type="checkbox"]').click(function () {
        var rarity = $(this).attr("data-rarity");
        if ($(this).prop("checked")) {
            calEquipsTable.rows('.rarity-' + rarity).select();
        } else {
            calEquipsTable.rows('.rarity-' + rarity).deselect();
        }
    });

    $('#pane-cal-equips .search-box input').keyup(function () {
        calEquipsTable.draw();
    });

    $('#btn-cal-equips-select-all').click(function () {
        $('.chk-cal-equips-origin input[type="checkbox"]').prop("checked", true);
        calEquipsTable.rows().select();
    });

    $('#btn-cal-equips-deselect-all').click(function () {
        $('.chk-cal-equips-origin input[type="checkbox"]').prop("checked", false);
        calEquipsTable.rows().deselect();
    });

    initCalEquipsShow(calEquipsTable);
}

function initCalMaterialsTable(data) {
    var calMaterialsColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": "materialId"
        },
        {
            "data": "name"
        },
        {
            "data": {
                "_": "rarity",
                "display": "rarityDisp"
            }
        },
        {
            "data": "origin"
        },
        {
            "data": "quantity",
            "className": "cal-td-input-quantity",
            "width": "38px"
        },
        {
            "data": "addition",
            "className": "cal-td-input-addition",
            "width": "38px"
        }
    ];

    var calMaterialsTable = $('#cal-materials-table').DataTable({
        data: new Array(),
        columns: calMaterialsColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 个",
            zeroRecords: "没有找到",
            info: "共 _MAX_ 个食材",
            infoEmpty: "没有数据",
            infoFiltered: "",
            select: {
                rows: {
                    _: "选择了 %d 个食材",
                    0: "选择了 %d 个食材",
                    1: "选择了 %d 个食材"
                }
            }
        },
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        select: {
            style: 'multi',
            selector: 'td.select-checkbox'
        },
        order: [[4, "desc"]],  //origin
        autoWidth: false,
        createdRow: function (row, data, index) {
            $(row).addClass('origin-' + data.originVal);
        }
    });

    $("#pane-cal-materials div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-materials-table')) {
            return true;
        }

        var value = $("#pane-cal-materials .search-box input").val();
        var searchCols = [2, 4];   //name, origin

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    calMaterialsTable.MakeCellsEditable({
        "columns": [5, 6]  // addition, quantity
    });

    $('.chk-cal-materials-show').click(function () {
        initCalMaterialsShow(calMaterialsTable);
    });

    $('.chk-cal-materials-origin input[type="checkbox"]').click(function () {
        var origin = $(this).attr("data-origin");
        if ($(this).prop("checked")) {
            calMaterialsTable.rows('.origin-' + origin).select();
        } else {
            calMaterialsTable.rows('.origin-' + origin).deselect();
        }
    });

    $('#pane-cal-materials .search-box input').keyup(function () {
        calMaterialsTable.draw();
    });

    $('#btn-cal-materials-select-all').click(function () {
        $('.chk-cal-materials-origin input[type="checkbox"]').prop("checked", true);
        calMaterialsTable.rows().select();
    });

    $('#btn-cal-materials-deselect-all').click(function () {
        $('.chk-cal-materials-origin input[type="checkbox"]').prop("checked", false);
        calMaterialsTable.rows().deselect();
    });

    initCalMaterialsShow(calMaterialsTable);
}

function initCalResultsTable(data) {

    $("#cal-recipes-results-place").html($("#pane-cal-results-common").html());
    $("#cal-recipes-results-place .cal-results-table").prop("id", "cal-recipes-results-table");
    $('#cal-recipes-results-place .chk-cal-results-show-selected').bootstrapToggle();

    $("#cal-optimal-recipes-results-place").html($("#pane-cal-results-common").html());
    $("#cal-optimal-recipes-results-place .cal-results-table").prop("id", "cal-optimal-recipes-results-table");
    $('#cal-optimal-recipes-results-place .chk-cal-results-show-selected').remove();

    $("#cal-all-results-place").html($("#pane-cal-results-common").html());
    $("#cal-all-results-place .cal-results-table").prop("id", "cal-all-results-table");
    $('#cal-all-results-place .chk-cal-results-show-selected').bootstrapToggle();

    $("#cal-optimal-results-place").html($("#pane-cal-results-common").html());
    $("#cal-optimal-results-place .cal-results-table").prop("id", "cal-optimal-results-table");
    $("#cal-optimal-results-place .chk-cal-results-show-selected").remove();

    initCalResultTableCommon("recipes", new Array(), $("#pane-cal-recipes-results"));
    initCalResultTableCommon("optimal-recipes", new Array(), $("#pane-cal-optimal-recipes-results"));
    initCalResultTableCommon("all", new Array(), $("#pane-cal-all-results"));
    initCalResultTableCommon("optimal", new Array(), $("#pane-cal-optimal-results"));

    var calRecipesWorker, calOptimalRecipesWorker, calAllWorker, calOptimalWorker;

    $('.btn-cal-results-cal').click(function () {

        var rule = Math.floor($("#input-rule-id").val());
        if (!rule) {
            alert("请加载规则");
            return;
        }

        var panel = $(this).closest(".pane-cal-results");
        var worker;
        var mode;

        if (panel.prop("id") == "pane-cal-all-results") {
            mode = "all";
            worker = calAllWorker;
        } else if (panel.prop("id") == "pane-cal-optimal-results") {
            mode = "optimal";
            worker = calOptimalWorker;
        } else if (panel.prop("id") == "pane-cal-recipes-results") {
            mode = "recipes";
            worker = calRecipesWorker;
        } else if (panel.prop("id") == "pane-cal-optimal-recipes-results") {
            mode = "optimal-recipes";
            worker = calOptimalRecipesWorker;
        } else {
            return;
        }

        if (typeof (worker) != "undefined") {
            worker.terminate();
            worker = undefined;
        }

        if ($(this).hasClass("stop")) {
            panel.find(".cal-results-progress").addClass("hidden");
            panel.find(".btn-cal-results-cal.start").prop("disabled", false);
            panel.find(".btn-cal-results-cal.stop").prop("disabled", true);
            return;
        }

        panel.find(".btn-cal-results-cal.start").prop("disabled", true);
        panel.find(".btn-cal-results-cal.stop").prop("disabled", false);
        panel.find(".cal-results-wrapper").addClass("hidden");
        panel.find(".cal-results-progress .progress-bar").css("width", "0%");
        panel.find(".cal-results-progress .progress-bar span").text("预处理中");
        panel.find(".cal-results-progress").removeClass("hidden");

        worker = new Worker("js/cal.js");
        if (mode == "all") {
            calAllWorker = worker;
        } else if (mode == "optimal") {
            calOptimalWorker = worker;
        } else if (mode == "recipes") {
            calRecipesWorker = worker;
        } else if (mode == "optimal-recipes") {
            calOptimalRecipesWorker = worker;
        }

        worker.onmessage = function (event) {
            if (event.data.progress) {
                panel.find(".cal-results-progress .progress-bar").css("width", event.data.progress.value + "%");
                panel.find(".cal-results-progress .progress-bar span").text(event.data.progress.display);
            } else if (event.data.menu) {

                if (event.data.message) {
                    panel.find(".selected-sum").html(event.data.message);
                } else {
                    panel.find(".selected-sum").html("点击可选择");
                }

                if (mode == "all") {
                    panel.find('.chk-cal-results-show-selected').prop("checked", false);
                    $("#cal-all-results-table").DataTable().clear().rows.add(event.data.menu).draw();
                } else if (mode == "optimal") {
                    $("#cal-optimal-results-table").DataTable().clear().rows.add(event.data.menu).draw();
                    $("#cal-optimal-results-table").DataTable().rows().select();
                } else if (mode == "recipes") {
                    panel.find('.chk-cal-results-show-selected').prop("checked", false);
                    $("#cal-recipes-results-table").DataTable().clear().rows.add(event.data.menu).draw();
                } else if (mode == "optimal-recipes") {
                    var menu = new Array();
                    if (event.data.menu.length) {
                        menu = event.data.menu[0];
                    }
                    $("#cal-optimal-recipes-results-table").DataTable().clear().rows.add(menu).draw();
                    $("#cal-optimal-recipes-results-table").DataTable().rows().select();
                }

                panel.find(".cal-results-wrapper").removeClass("hidden");

            } else if (event.data.done) {
                panel.find(".btn-cal-results-cal.stop").prop("disabled", true);
                panel.find(".btn-cal-results-cal.start").prop("disabled", false);
                panel.find(".cal-results-progress").addClass("hidden");

            }
        };

        var calRecipesData = $('#cal-recipes-table').DataTable().rows({ selected: true }).data().toArray();
        var calChefsData = $('#cal-chefs-table').DataTable().rows({ selected: true }).data().toArray();
        var calEquipsData = $('#cal-equips-table').DataTable().rows({ selected: true }).data().toArray();
        var calMaterialsData = $('#cal-materials-table').DataTable().rows({ selected: true }).data().toArray();
        var allLimit = Math.floor($("#input-cal-all-results-show-top").val());
        var optimalRecipesLimit = Math.floor($("#input-cal-optimal-recipes-results-show-top").val());
        var autoEquips = $('#chk-cal-results-equips').prop("checked");

        worker.postMessage({
            "mode": mode,
            "rule": rule,
            "recipes": calRecipesData,
            "chefs": calChefsData,
            "equips": calEquipsData,
            "materials": calMaterialsData,
            "odata": data,
            "allLimit": allLimit,
            "optimalRecipesLimit": optimalRecipesLimit,
            "autoEquips": autoEquips
        });
    });
}

function initCalResultTableCommon(mode, data, panel) {

    var calResultsColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": "chef.name",
            "className": "cal-td-chef-name",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.rarity",
                "display": "chef.rarityDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "chef.gender",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.stirfryVal",
                "display": "chef.stirfryDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.boilVal",
                "display": "chef.boilDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.knifeVal",
                "display": "chef.knifeDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.fryVal",
                "display": "chef.fryDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.bakeVal",
                "display": "chef.bakeDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "chef.steamVal",
                "display": "chef.steamDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "recipe.data.name",
            "className": "cal-td-recipe-name",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.data.rarity",
                "display": "recipe.data.rarityDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "recipe.data.stirfry",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.boil",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.knife",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.fry",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.bake",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.steam",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.data.materialsVal",
                "display": "recipe.data.materialsDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "recipe.data.price",
            "defaultContent": ""
        },
        {
            "data": "recipe.quantity",
            "className": "cal-td-quantity",
            "defaultContent": "",
            "width": "38px"
        },
        {
            "data": {
                "_": "recipe.rankVal",
                "display": "recipe.rankDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.rankAddition",
                "display": "recipe.rankAdditionDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.chefSkillAddition",
                "display": "recipe.chefSkillAdditionDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "equip.disp",
            "className": "cal-td-equip-name",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.equipSkillAddition",
                "display": "recipe.equipSkillAdditionDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.data.otherAddition",
                "display": "recipe.data.otherAdditionDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.data.ultimateAddition",
                "display": "recipe.data.ultimateAdditionDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "recipe.totalPrice",
            "defaultContent": ""
        },
        {
            "data": "recipe.totalRealPrice",
            "defaultContent": ""
        },
        {
            "data": "recipe.totalBonusScore",
            "defaultContent": ""
        },
        {
            "data": "recipe.totalScore",
            "defaultContent": ""
        }
    ];

    var paging = true;
    if (mode == "optimal-recipes" || mode == "optimal" || mode == "self-select") {
        paging = false;
    }

    var order = [[31, "desc"]]  //score
    if (mode == "self-select") {
        order = [];
    }


    var table = panel.find('.cal-results-table').DataTable({
        data: data,
        columns: calResultsColumns,
        language: {
            search: "查找:",
            lengthMenu: "一页显示 _MENU_ 条",
            zeroRecords: "没有找到",
            info: "共 _TOTAL_ 条",
            infoEmpty: "没有数据",
            infoFiltered: "(从 _MAX_ 条中过滤)",
            select: {
                rows: {
                    _: "选择了 %d 条",
                    0: "选择了 %d 条",
                    1: "选择了 %d 条"
                }
            }
        },
        paging: paging,
        pagingType: "numbers",
        lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
        pageLength: 20,
        dom: "<'row'<'col-sm-12'<'selected-sum'>>>" +
            "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12'p>>",
        select: {
            style: 'multi',
            selector: 'td.select-checkbox'
        },
        autoWidth: false,
        order: order
    });

    panel.find(".selected-sum").html("点击可选择");

    if (mode == "all" || mode == "recipes") {
        panel.find("div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="厨师 菜名 材料"></label>');
        panel.find('.search-box input').keyup(function () {
            table.draw();
        });

        panel.find('.chk-cal-results-show-selected').prop("checked", false);

        var allResultsSearchInput = "";
        var selectedResultsSearchInput = "";
        panel.find('.chk-cal-results-show-selected').change(function () {
            if ($(this).prop("checked")) {
                allResultsSearchInput = panel.find('.search-box input').val();
                panel.find('.search-box input').val(selectedResultsSearchInput);
            } else {
                selectedResultsSearchInput = panel.find('.search-box input').val();
                panel.find('.search-box input').val(allResultsSearchInput);
            }
            table.draw();
        });
    }

    table.on('select deselect', function (e, dt, type, indexes) {
        if (type === 'row') {
            var selectedRows = dt.rows({ selected: true }).indexes();

            var totalPrice = dt.cells(selectedRows, 28).data().reduce(function (a, b) { return a + b; }, 0);    //totalPrice
            var sumText = "原售价：" + totalPrice;

            if (mode == "all" || mode == "optimal" || mode == "self-select") {
                var totalRealPrice = dt.cells(selectedRows, 29).data().reduce(function (a, b) { return a + b; }, 0);    //totalRealPrice
                sumText += " 实售价：" + totalRealPrice;
            }

            var totalBonusScore = dt.cells(selectedRows, 30).data().reduce(function (a, b) { return a + b; }, 0);    //totalBonusScore
            sumText += " 规则分：" + totalBonusScore;

            var totalScore = dt.cells(selectedRows, 31).data().reduce(function (a, b) { return a + b; }, 0);    //totalScore
            sumText += " 总得分：" + totalScore;

            panel.find(".selected-sum").html(sumText);

            if (mode == "all" || mode == "recipes") {
                if (panel.find('.chk-cal-results-show-selected').prop("checked")) {
                    table.draw();
                }
            }
        }
    });

    panel.find('.chk-cal-results-show').click(function () {
        initCalResultsShow(mode, table, panel);
    });

    panel.find('.chk-cal-results-show-all').click(function () {
        if (panel.find('.btn:not(.hidden) .chk-cal-results-show:checked').length == panel.find('.btn:not(.hidden) .chk-cal-results-show').length) {
            panel.find('.btn:not(.hidden) .chk-cal-results-show').prop("checked", false);
        }
        else {
            panel.find('.btn:not(.hidden) .chk-cal-results-show').prop("checked", true);
        }
        initCalResultsShow(mode, table, panel);
    });

    if (mode == "all") {
        $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
            if (settings.nTable != document.getElementById('cal-all-results-table')) {
                return true;
            }

            var value = $("#pane-cal-all-results .search-box input").val();
            var searchCols = [1, 10, 18];   //chefname, recipename, materials

            for (var i = 0, len = searchCols.length; i < len; i++) {
                if (data[searchCols[i]].indexOf(value) !== -1) {
                    return true;
                }
            }

            return false;
        });

        $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
            if (settings.nTable != document.getElementById('cal-all-results-table')) {
                return true;
            }

            if ($('#pane-cal-all-results .chk-cal-results-show-selected').prop("checked")) {
                var tr = settings.aoData[dataIndex].nTr;
                if ($(tr).hasClass("selected")) {
                    return true;
                }
                else {
                    return false;
                }
            } else {
                return true;
            }
        });
    } else if (mode == "recipes") {
        $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
            if (settings.nTable != document.getElementById('cal-recipes-results-table')) {
                return true;
            }

            var value = $("#pane-cal-recipes-results .search-box input").val();
            var searchCols = [1, 10, 18];   //chefname, recipename, materials

            for (var i = 0, len = searchCols.length; i < len; i++) {
                if (data[searchCols[i]].indexOf(value) !== -1) {
                    return true;
                }
            }

            return false;
        });

        $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
            if (settings.nTable != document.getElementById('cal-recipes-results-table')) {
                return true;
            }

            if ($('#pane-cal-recipes-results .chk-cal-results-show-selected').prop("checked")) {
                var tr = settings.aoData[dataIndex].nTr;
                if ($(tr).hasClass("selected")) {
                    return true;
                }
                else {
                    return false;
                }
            } else {
                return true;
            }
        });
    }

    initCalResultsShow(mode, table, panel);

    return table;
}

function initCalSelfSelect(data) {

    $("#cal-self-select-place").html($("#pane-cal-results-common").html());
    $("#cal-self-select-place .cal-results-table").prop("id", "cal-self-select-table");
    $("#cal-self-select-place .chk-cal-results-show-selected").remove();

    $("#cal-self-select-place .chk-cal-results-show-chef-equip").prop("checked", true);

    var selfSelectData = new Array();
    for (var i = 0; i < 9; i++) {
        var oneMenu = new Object();
        oneMenu["chef"] = new Object();
        oneMenu["recipe"] = new Object();
        oneMenu["recipe"]["data"] = new Object();
        oneMenu["equip"] = new Object();
        selfSelectData.push(oneMenu);
    }
    var table = initCalResultTableCommon("self-select", selfSelectData, $("#pane-cal-self-select"));

    $("#pane-cal-self-select").find(".cal-results-wrapper").removeClass("hidden");

}

function generateData(json, json2, person) {

    if (json2) {
        json.equips = json.equips.concat(json2.equips);
        json.quests = json.quests.concat(json2.quests);
        json.recipes = json.recipes.concat(json2.recipes);
        json.chefs = json.chefs.concat(json2.chefs);
        json.skills = json.skills.concat(json2.skills);
        json.ultimateGoals = json.ultimateGoals.concat(json2.ultimateGoals);
    }

    var retData = new Object();

    retData["guests"] = json.guests;

    retData["history"] = json.history;

    retData["skills"] = json.skills;

    var materialsData = new Array();
    for (var i in json.materials) {
        var materialData = json.materials[i];
        materialData["rarityDisp"] = getRarityDisp(json.materials[i].rarity);
        materialData["originVal"] = getOriginVal(json.materials[i].origin);
        materialData["addition"] = "";
        materialData["quantity"] = "";
        materialsData.push(materialData);
    }
    retData["materials"] = materialsData;

    var equipsData = new Array();
    for (var i in json.equips) {

        if (!json.equips[i].name) {
            continue;
        }

        var equip = json.equips[i];
        equip["rarityDisp"] = getRarityDisp(json.equips[i].rarity);
        var skillInfo = getSkillInfo(json.skills, json.equips[i].skill);
        equip["skillDisp"] = skillInfo.skillDisp;
        equip["effect"] = skillInfo.skillEffect;
        equip["cal"] = isCalEquip(skillInfo.skillEffect);

        equipsData.push(equip);
    }
    retData["equips"] = equipsData;

    var questsData = new Array();
    for (var i in json.quests) {

        if (!json.quests[i].goal) {
            continue;
        }

        var questData = json.quests[i];
        var rewardsDisp = "";
        var rewardsVal = "";
        for (var j in json.quests[i].rewards) {
            rewardsDisp += json.quests[i].rewards[j].name;
            if (json.quests[i].rewards[j].quantity) {
                rewardsDisp += "*" + json.quests[i].rewards[j].quantity;
            }
            rewardsDisp += " ";
            rewardsVal += json.quests[i].rewards[j].name;
        }
        questData["rewardsVal"] = rewardsVal;
        questData["rewardsDisp"] = rewardsDisp;

        questsData.push(questData);
    }
    retData["quests"] = questsData;

    var useEquip = $("#chk-chef-apply-equips").prop("checked");
    var useUltimate = $("#chk-chef-apply-ultimate").prop("checked");
    var usePerson = $("#chk-chef-apply-ultimate-person").prop("checked");
    var ultimateData = getUltimateData(json.chefs, person, json.skills, useUltimate, usePerson);

    var chefsData = new Array();
    for (var i in json.chefs) {

        if (!json.chefs[i].name) {
            continue;
        }

        var chefData = json.chefs[i];
        chefData["recipes"] = new Array();

        chefData["meat"] = json.chefs[i].meat || "";
        chefData["creation"] = json.chefs[i].creation || "";
        chefData["veg"] = json.chefs[i].veg || "";
        chefData["fish"] = json.chefs[i].fish || "";
        chefData["addition"] = "";

        chefData["chefIdDisp"] = (json.chefs[i].chefId - 2) + " - " + json.chefs[i].chefId;
        chefData["rarityDisp"] = getRarityDisp(json.chefs[i].rarity);

        var skillInfo = getSkillInfo(json.skills, json.chefs[i].skill);
        chefData["specialSkillDisp"] = skillInfo.skillDisp;
        chefData["specialSkillEffect"] = skillInfo.skillEffect;

        if (json2) {
            for (var j in json2.chefsTags) {
                if (json.chefs[i].chefId == json2.chefsTags[j].chefId) {
                    chefData["tags"] = json2.chefsTags[j].tags;
                    chefData["tagsDisp"] = getTagsDisp(json2.chefsTags[j].tags, json2.tags);
                }
            }
        }

        var ultimateGoal = "";
        var ultimateSkillDisp = "";

        if (json.chefs[i].rarity < 5 || private) {
            for (var j in json.chefs[i].ultimateGoal) {
                for (var k in json.ultimateGoals) {
                    if (json.chefs[i].ultimateGoal[j] == json.ultimateGoals[k].goalId) {
                        ultimateGoal += json.ultimateGoals[k].goal + "<br>";
                        break;
                    }
                }
            }
            var ultimateSkillInfo = getSkillInfo(json.skills, json.chefs[i].ultimateSkill);
            ultimateSkillDisp = ultimateSkillInfo.skillDisp;
        }

        chefData["ultimateGoal"] = ultimateGoal;
        chefData["ultimateSkillDisp"] = ultimateSkillDisp;

        chefData["got"] = "";
        chefData["ultimate"] = "";
        chefData["equip"] = null;
        chefData["equipName"] = "";
        chefData["equipDisp"] = "";

        if (person) {
            for (var j in person.chefs) {
                if (json.chefs[i].chefId == person.chefs[j].id) {
                    if (person.chefs[j].hasOwnProperty("got")) {
                        chefData["got"] = person.chefs[j].got;
                    }
                    if (person.chefs[j].hasOwnProperty("ult")) {
                        chefData["ultimate"] = person.chefs[j].ult;
                    }
                    if (person.chefs[j].hasOwnProperty("equip")) {
                        for (var k in equipsData) {
                            if (person.chefs[j].equip == equipsData[k].equipId) {
                                chefData["equip"] = equipsData[k];
                                chefData["equipName"] = equipsData[k].name;
                                chefData["equipDisp"] = equipsData[k].name + "<br>" + equipsData[k].skillDisp;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }

        setDataForChef(chefData, ultimateData, useEquip);

        chefsData.push(chefData);
    }
    retData["chefs"] = chefsData;

    var recipesData = new Array();
    for (var i in json.recipes) {

        if (!json.recipes[i].name) {
            continue;
        }

        var recipeData = new Object();
        recipeData = json.recipes[i];

        recipeData["stirfry"] = json.recipes[i].stirfry || "";
        recipeData["boil"] = json.recipes[i].boil || "";
        recipeData["knife"] = json.recipes[i].knife || "";
        recipeData["fry"] = json.recipes[i].fry || "";
        recipeData["bake"] = json.recipes[i].bake || "";
        recipeData["steam"] = json.recipes[i].steam || "";
        recipeData["addition"] = "";

        recipeData["skillDisp"] = getSkillDisp(json.recipes[i]);

        recipeData["timeDisp"] = secondsToTime(json.recipes[i].time);
        recipeData["rarityDisp"] = getRarityDisp(json.recipes[i].rarity);

        if (json2) {
            for (var j in json2.recipesTags) {
                if (json.recipes[i].recipeId == json2.recipesTags[j].recipeId) {
                    recipeData["tags"] = json2.recipesTags[j].tags;
                    recipeData["tagsDisp"] = getTagsDisp(json2.recipesTags[j].tags, json2.tags);
                }
            }
        }

        setDataForRecipe(recipeData, ultimateData);

        recipeData["rank"] = "";
        recipeData["got"] = "";

        if (person) {
            for (var j in person.recipes) {
                if (json.recipes[i].recipeId == person.recipes[j].id) {
                    if (person.recipes[j].hasOwnProperty("rank")) {
                        recipeData["rank"] = person.recipes[j].rank;
                    }
                    if (person.recipes[j].hasOwnProperty("got")) {
                        recipeData["got"] = person.recipes[j].got;
                    }
                    break;
                }
            }
        }

        recipeData["efficiency"] = Math.floor(json.recipes[i].price * 3600 / json.recipes[i].time);

        var materialsInfo = getMaterialsInfo(json.recipes[i], json.materials);
        recipeData["materialsVal"] = materialsInfo.materialsVal;
        recipeData["materialsDisp"] = materialsInfo.materialsDisp;

        var materialsEff = 0;
        if (json.recipes[i].time > 0) {
            materialsEff = materialsInfo.materialsCount * 3600 / json.recipes[i].time;
        }
        recipeData["materialsEff"] = materialsEff ? Math.floor(materialsEff) : "";

        var rankGuestInfo = getRankGuestInfo(json.recipes[i], recipeData.rank, json.guests);
        recipeData["rankGuestsVal"] = rankGuestInfo.rankGuestsVal;
        recipeData["rankGuestsDisp"] = rankGuestInfo.rankGuestsDisp;

        var godAntiqueDisp = "";
        if (json.recipes[i].godAntique) {
            if (isNaN(json.recipes[i].godAntique)) {
                godAntiqueDisp = json.recipes[i].godAntique;
            } else {
                for (var j in json.antiques) {
                    if (json.recipes[i].godAntique == json.antiques[j].antiqueId) {
                        godAntiqueDisp = json.antiques[j].name;
                        break;
                    }
                }
            }
        }
        recipeData["godAntiqueDisp"] = godAntiqueDisp;

        var guests = "";
        for (var m in json.guests) {
            for (var n in json.guests[m].gifts) {
                if (json.recipes[i].name == json.guests[m].gifts[n].recipe) {
                    guests += json.guests[m].name + "-" + json.guests[m].gifts[n].antique + "<br>";
                    break;
                }
            }
        }
        recipeData["guestsDisp"] = guests;

        recipeData["chefs"] = new Array();
        for (var j in retData["chefs"]) {

            var rankInfo = getRankInfo(json.recipes[i], retData["chefs"][j]);

            var chefEff = 0;

            if (rankInfo.rankVal > 0) {
                var timeAddition = getTimeAddition(retData["chefs"][j].specialSkillEffect);
                var skillAddition = getSkillAddition(json.recipes[i], retData["chefs"][j].specialSkillEffect, retData["materials"]);
                if (useEquip && retData["chefs"][j].equip) {
                    timeAddition += getTimeAddition(retData["chefs"][j].equip.effect);
                    skillAddition += getSkillAddition(json.recipes[i], retData["chefs"][j].equip.effect, retData["materials"]);
                }

                chefEff = (1 + rankInfo.rankAddition + skillAddition + recipeData.ultimateAddition) * Math.floor(json.recipes[i].price * 3600 / (json.recipes[i].time * (1 + timeAddition)));
            }

            var recipeChefData = new Object();
            recipeChefData["rankVal"] = rankInfo.rankVal;
            recipeChefData["rankDisp"] = rankInfo.rankDisp;
            recipeChefData["efficiency"] = Math.floor(chefEff) || "";
            recipeData["chefs"].push(recipeChefData);

            var chefRecipeData = new Object();
            chefRecipeData["rankVal"] = rankInfo.rankVal;
            chefRecipeData["rankDisp"] = rankInfo.rankDisp;
            chefRecipeData["efficiency"] = Math.floor(chefEff) || "";
            retData["chefs"][j]["recipes"].push(chefRecipeData);
        }

        recipesData.push(recipeData);
    }

    retData["recipes"] = recipesData;

    return retData;
}

function updateRecipeChefTable(data) {
    $('.loading').removeClass("hidden");

    setTimeout(function () {
        data = getUpdateData(data);
        $('#recipe-table').DataTable().clear().rows.add(data.recipes).draw(false);
        $('#chef-table').DataTable().clear().rows.add(data.chefs).draw(false);
        $('.loading').addClass("hidden");
    }, 500);

    $("#btn-chef-recal").removeClass("btn-danger").addClass("btn-default");
}

function getUpdateData(data) {

    var person;
    try {
        var localData = localStorage.getItem('data');
        person = JSON.parse(localData);
    } catch (e) { }

    var useEquip = $("#chk-chef-apply-equips").prop("checked");
    var useUltimate = $("#chk-chef-apply-ultimate").prop("checked");
    var usePerson = $("#chk-chef-apply-ultimate-person").prop("checked");
    var ultimateData = getUltimateData(data.chefs, person, data.skills, useUltimate, usePerson);

    for (var i in data.chefs) {
        setDataForChef(data.chefs[i], ultimateData, useEquip);
    }

    for (var i in data.recipes) {
        setDataForRecipe(data.recipes[i], ultimateData);

        for (var j in data.chefs) {
            var rankInfo = getRankInfo(data.recipes[i], data.chefs[j]);

            var chefEff = 0;

            if (rankInfo.rankVal > 0) {
                var timeAddition = getTimeAddition(data.chefs[j].specialSkillEffect);
                var skillAddition = getSkillAddition(data.recipes[i], data.chefs[j].specialSkillEffect, data.materials);
                if (useEquip && data.chefs[j].equip) {
                    timeAddition += getTimeAddition(data.chefs[j].equip.effect);
                    skillAddition += getSkillAddition(data.recipes[i], data.chefs[j].equip.effect, data.materials);
                }

                chefEff = (1 + rankInfo.rankAddition + skillAddition + data.recipes[i].ultimateAddition) * Math.floor(data.recipes[i].price * 3600 / (data.recipes[i].time * (1 + timeAddition)));
            }

            var recipeChefData = new Object();
            recipeChefData["rankVal"] = rankInfo.rankVal;
            recipeChefData["rankDisp"] = rankInfo.rankDisp;
            recipeChefData["efficiency"] = Math.floor(chefEff) || "";
            data.recipes[i]["chefs"][j] = recipeChefData;

            var chefRecipeData = new Object();
            chefRecipeData["rankVal"] = rankInfo.rankVal;
            chefRecipeData["rankDisp"] = rankInfo.rankDisp;
            chefRecipeData["efficiency"] = Math.floor(chefEff) || "";
            data.chefs[j]["recipes"][i] = chefRecipeData;
        }
    }

    return data;
}

function getQuestsData(quests, type) {
    var retData = new Array();
    for (var i in quests) {
        if (quests[i].type == type) {
            retData.push(quests[i]);
        }
    }
    return retData;
}

function getMaterialsInfo(recipe, materials) {
    var materialsInfo = new Object();
    var materialsDisp = "";
    var materialsVal = "";
    var materialsCount = 0;

    for (var k in recipe.materials) {
        for (var m in materials) {
            if (recipe.materials[k].material == materials[m].materialId) {
                materialsDisp += materials[m].name + "*" + recipe.materials[k].quantity + " ";
                materialsVal += materials[m].name;
                materialsCount += recipe.materials[k].quantity;
                recipe.materials[k]["origin"] = materials[m].origin;
                break;
            }
        }
    }
    materialsInfo["materialsDisp"] = materialsDisp;
    materialsInfo["materialsVal"] = materialsVal;
    materialsInfo["materialsCount"] = materialsCount;
    return materialsInfo;
}

function getRarityDisp(rarity) {
    var rarityDisp = "";
    for (var j = 0; j < rarity; j++) {
        rarityDisp += "&#x2605;";
    }
    return rarityDisp;
}

function getTagsDisp(tagIds, tags) {
    var disp = "";
    for (var j in tagIds) {
        for (var k in tags) {
            if (tagIds[j] == tags[k].Id) {
                disp += tags[k].name + " ";
                break;
            }
        }
    }
    return disp;
}

function isCalEquip(skill) {
    var result = false;
    for (var j in skill) {
        if (skill[j].type.indexOf("料理") >= 0
            || skill[j].type.indexOf("金币获得") >= 0
            || skill[j].type.indexOf("技法") >= 0) {
            return true;
        }
    }
    return result;
}

function getOriginVal(origin) {
    var originVal = 0;
    if (origin == "菜棚") {
        originVal = 1;
    } else if (origin == "菜地") {
        originVal = 2;
    } else if (origin == "森林") {
        originVal = 3;
    } else if (origin == "鸡舍") {
        originVal = 4;
    } else if (origin == "猪圈") {
        originVal = 5;
    } else if (origin == "牧场") {
        originVal = 6;
    } else if (origin == "作坊") {
        originVal = 7;
    } else if (origin == "鱼塘") {
        originVal = 8;
    }
    return originVal;
}

function getRankGuestInfo(recipe, rank, guests) {
    var rankGuestsDisp = "";
    var rankGuestsVal = "";

    var filter = $('#chk-recipe-filter-guest').prop("checked");

    for (var i in recipe.guests) {
        if (filter) {
            if (rank == "优" && recipe.guests[i].rank == "优"
                || rank == "特" && recipe.guests[i].rank != "神"
                || rank == "神") {
                continue;
            }
        }
        var guestName = "";
        if (recipe.guests[i].guest) {
            for (var j in guests) {
                if (recipe.guests[i].guest == guests[j].guestId) {
                    guestName = guests[j].name;
                    break;
                }
            }
        }
        rankGuestsDisp += recipe.guests[i].rank + "-" + guestName + "<br>";
        rankGuestsVal += guestName;
    }

    var retData = new Object();
    retData["rankGuestsVal"] = rankGuestsVal;
    retData["rankGuestsDisp"] = rankGuestsDisp;
    return retData;
}

function setDataForChef(chefData, ultimateData, useEquip) {

    chefData["stirfryVal"] = chefData.stirfry;
    chefData["boilVal"] = chefData.boil;
    chefData["knifeVal"] = chefData.knife;
    chefData["fryVal"] = chefData.fry;
    chefData["bakeVal"] = chefData.bake;
    chefData["steamVal"] = chefData.steam;

    chefData["stirfryDisp"] = chefData.stirfry || "";
    chefData["boilDisp"] = chefData.boil || "";
    chefData["knifeDisp"] = chefData.knife || "";
    chefData["fryDisp"] = chefData.fry || "";
    chefData["bakeDisp"] = chefData.bake || "";
    chefData["steamDisp"] = chefData.steam || "";

    var stirfryAddition = 0;
    var bakeAddition = 0;
    var steamAddition = 0;
    var boilAddition = 0;
    var fryAddition = 0;
    var knifeAddition = 0;

    for (var i in ultimateData) {
        if (ultimateData[i].type.indexOf("全体厨师炒技法") >= 0) {
            stirfryAddition += ultimateData[i].addition;
        } else if (ultimateData[i].type.indexOf("全体厨师烤技法") >= 0) {
            bakeAddition += ultimateData[i].addition;
        } else if (ultimateData[i].type.indexOf("全体厨师蒸技法") >= 0) {
            steamAddition += ultimateData[i].addition;
        } else if (ultimateData[i].type.indexOf("全体厨师煮技法") >= 0) {
            boilAddition += ultimateData[i].addition;
        } else if (ultimateData[i].type.indexOf("全体厨师炸技法") >= 0) {
            fryAddition += ultimateData[i].addition;
        } else if (ultimateData[i].type.indexOf("全体厨师切技法") >= 0) {
            knifeAddition += ultimateData[i].addition;
        } else if (ultimateData[i].type.indexOf("全体男厨子全技法") >= 0) {
            if (chefData.gender == "男") {
                stirfryAddition += ultimateData[i].addition;
                bakeAddition += ultimateData[i].addition;
                steamAddition += ultimateData[i].addition;
                boilAddition += ultimateData[i].addition;
                fryAddition += ultimateData[i].addition;
                knifeAddition += ultimateData[i].addition;
            }
        }
    }

    if (useEquip && chefData.equip) {
        var effect = chefData.equip.effect;
        for (var i in effect) {
            var type = effect[i].type;
            var addition = effect[i].addition;
            if (type.indexOf("炒技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    stirfryAddition += addition;
                } else {
                    stirfryAddition += chefData.stirfry * (1 + addition);
                }
            }
            if (type.indexOf("煮技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    boilAddition += addition;
                } else {
                    boilAddition += chefData.boil * (1 + addition);
                }
            }
            if (type.indexOf("切技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    knifeAddition += addition;
                } else {
                    knifeAddition += chefData.knife * (1 + addition);
                }
            }
            if (type.indexOf("炸技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    fryAddition += addition;
                } else {
                    fryAddition += chefData.fry * (1 + addition);
                }
            }
            if (type.indexOf("烤技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    bakeAddition += addition;
                } else {
                    bakeAddition += chefData.bake * (1 + addition);
                }
            }
            if (type.indexOf("蒸技法") >= 0
                || type.indexOf("全技法") >= 0) {
                if (isInt(addition)) {
                    steamAddition += addition;
                } else {
                    steamAddition += chefData.steam * (1 + addition);
                }
            }
        }
    }

    if (stirfryAddition) {
        chefData.stirfryVal += stirfryAddition;
        chefData.stirfryDisp += " +" + stirfryAddition;
    }
    if (boilAddition) {
        chefData.boilVal += boilAddition;
        chefData.boilDisp += " +" + boilAddition;
    }
    if (knifeAddition) {
        chefData.knifeVal += knifeAddition;
        chefData.knifeDisp += " +" + knifeAddition;
    }
    if (fryAddition) {
        chefData.fryVal += fryAddition;
        chefData.fryDisp += " +" + fryAddition;
    }
    if (bakeAddition) {
        chefData.bakeVal += bakeAddition;
        chefData.bakeDisp += " +" + bakeAddition;
    }
    if (steamAddition) {
        chefData.steamVal += steamAddition;
        chefData.steamDisp += " +" + steamAddition;
    }
}

function setDataForRecipe(recipeData, ultimateData) {
    recipeData["limitVal"] = recipeData.limit;
    recipeData["ultimateAddition"] = 0;

    for (var i in ultimateData) {
        if (ultimateData[i].type.indexOf("1星菜谱上限") >= 0 && recipeData.rarity == 1
            || ultimateData[i].type.indexOf("2星菜谱上限") >= 0 && recipeData.rarity == 2
            || ultimateData[i].type.indexOf("3星菜谱上限") >= 0 && recipeData.rarity == 3
            || ultimateData[i].type.indexOf("4星菜谱上限") >= 0 && recipeData.rarity == 4
            || ultimateData[i].type.indexOf("5星菜谱上限") >= 0 && recipeData.rarity == 5) {
            recipeData.limitVal += ultimateData[i].addition;
        }
        if (ultimateData[i].type.indexOf("1星菜谱售价") >= 0 && recipeData.rarity == 1
            || ultimateData[i].type.indexOf("2星菜谱售价") >= 0 && recipeData.rarity == 2
            || ultimateData[i].type.indexOf("3星菜谱售价") >= 0 && recipeData.rarity == 3
            || ultimateData[i].type.indexOf("4星菜谱售价") >= 0 && recipeData.rarity == 4
            || ultimateData[i].type.indexOf("5星菜谱售价") >= 0 && recipeData.rarity == 5) {
            recipeData.ultimateAddition += ultimateData[i].addition;
        }
    }

    recipeData["ultimateAdditionDisp"] = recipeData.ultimateAddition || "";;
    recipeData["totalPrice"] = recipeData.price * recipeData.limitVal;
    recipeData["totalTime"] = recipeData.time * recipeData.limitVal;
    recipeData["totalTimeDisp"] = secondsToTime(recipeData.totalTime);
}

function getRankOptions() {
    var list = new Array();
    var option = new Object();
    option["display"] = "";
    option["value"] = "";
    list.push(option);
    option = new Object();
    option["display"] = "优";
    option["value"] = "优";
    list.push(option);
    option = new Object();
    option["display"] = "特";
    option["value"] = "特";
    list.push(option);
    option = new Object();
    option["display"] = "神";
    option["value"] = "神";
    list.push(option);

    return list;
}

function getGotOptions() {
    var list = new Array();
    var option = new Object();
    option["display"] = "否";
    option["value"] = "";
    list.push(option);
    option = new Object();
    option["display"] = "是";
    option["value"] = "是";
    list.push(option);

    return list;
}

function getEquipsOptions(equips, skills) {
    var list = new Array();
    var option = new Object();
    option["display"] = "无厨具";
    option["subtext"] = "";
    option["tokens"] = "";
    option["value"] = "";
    list.push(option);
    for (var i in equips) {
        var skillInfo = getSkillInfo(skills, equips[i].skill);
        var skillDisp = skillInfo.skillDisp.replace("<br>", " ");
        var option = new Object();
        option["display"] = equips[i].name;
        option["subtext"] = skillDisp;
        option["tokens"] = equips[i].name + skillDisp;
        option["value"] = equips[i].name;
        list.push(option);
    }
    return list;
}

function getChefsOptions(chefs) {
    var list = new Array();
    var option = new Object();
    option["display"] = "无厨师";
    option["value"] = "";
    list.push(option);
    for (var i in chefs) {
        var option = new Object();
        option["display"] = chefs[i].name;
        option["value"] = chefs[i].name;
        list.push(option);
    }
    return list;
}

function getRecipesOptions(recipes) {
    var list = new Array();
    var option = new Object();
    option["display"] = "无菜谱";
    option["value"] = "";
    list.push(option);
    for (var i in recipes) {
        var option = new Object();
        option["display"] = recipes[i].name;
        option["value"] = recipes[i].name;
        list.push(option);
    }
    return list;
}

function getSkillInfo(skills, skillId) {
    var skillInfo = new Object();
    var skillDisp = "";
    var skillEffect = new Array();

    var skillIds = [];
    if (skillId.constructor === Array) {
        skillIds = skillId;
    } else {
        if (skillId) {
            skillIds.push(skillId);
        }
    }

    for (var j in skillIds) {
        var found = false;
        for (var k in skills) {
            if (skills[k].skillId == skillIds[j]) {
                for (var m in skills[k].effect) {
                    var type = skills[k].effect[m].type;
                    var addition = skills[k].effect[m].addition;

                    skillDisp += type + " ";

                    if (type.indexOf("稀有客人出现概率") >= 0) {
                        if (addition > 0) {
                            skillDisp += "+";
                        }
                        skillDisp += mul(addition, 100) + "%<br>";
                    } else {
                        if (isNaN(addition)) {
                            skillDisp += addition;
                        }
                        else {
                            if (addition) {
                                if (addition > 0) {
                                    skillDisp += "+";
                                }
                                if (isInt(addition)) {
                                    skillDisp += addition;
                                } else {
                                    skillDisp += mul(addition, 100) + "%";
                                }
                            }
                        }
                        skillDisp += "<br>";
                    }

                    skillEffect.push(skills[k].effect[m]);
                }
                found = true;
                break;
            }
        }
        if (!found) {
            console.log(skillIds[j]);
        }
    }
    skillInfo["skillDisp"] = skillDisp;
    skillInfo["skillEffect"] = skillEffect;
    return skillInfo;
}

function getSkillDisp(recipe) {
    var disp = "";
    if (recipe.stirfry) {
        disp += "炒" + recipe.stirfry;
    }
    if (recipe.boil) {
        disp += "煮" + recipe.boil;
    }
    if (recipe.knife) {
        disp += "切" + recipe.knife;
    }
    if (recipe.fry) {
        disp += "炸" + recipe.fry;
    }
    if (recipe.bake) {
        disp += "烤" + recipe.bake;
    }
    if (recipe.steam) {
        disp += "蒸" + recipe.steam;
    }
    return disp;
}

function initRecipeShow(recipeTable, data) {
    recipeTable.column(0).visible($('#chk-recipe-show-id').prop("checked"), false);
    recipeTable.column(2).visible($('#chk-recipe-show-rarity').prop("checked"), false);

    var chkSkill = $('#chk-recipe-show-skill').prop("checked");
    recipeTable.column(3).visible(chkSkill, false);
    recipeTable.column(4).visible(chkSkill, false);
    recipeTable.column(5).visible(chkSkill, false);
    recipeTable.column(6).visible(chkSkill, false);
    recipeTable.column(7).visible(chkSkill, false);
    recipeTable.column(8).visible(chkSkill, false);
    recipeTable.column(9).visible($('#chk-recipe-show-materials').prop("checked"), false);
    recipeTable.column(10).visible($('#chk-recipe-show-price').prop("checked"), false);
    recipeTable.column(11).visible($('#chk-recipe-show-time').prop("checked"), false);
    recipeTable.column(12).visible($('#chk-recipe-show-limit').prop("checked"), false);
    recipeTable.column(13).visible($('#chk-recipe-show-total-price').prop("checked"), false);
    recipeTable.column(14).visible($('#chk-recipe-show-total-time').prop("checked"), false);
    recipeTable.column(15).visible($('#chk-recipe-show-efficiency').prop("checked"), false);
    recipeTable.column(16).visible($('#chk-recipe-show-materials-efficiency').prop("checked"), false);
    recipeTable.column(17).visible($('#chk-recipe-show-origin').prop("checked"), false);
    recipeTable.column(18).visible($('#chk-recipe-show-unlock').prop("checked"), false);

    if (private) {
        recipeTable.column(19).visible($('#chk-recipe-show-tags').prop("checked"), false);
    } else {
        recipeTable.column(19).visible(false, false);
    }

    recipeTable.column(20).visible($('#chk-recipe-show-guest').prop("checked"), false);
    recipeTable.column(21).visible($('#chk-recipe-show-rank-guest').prop("checked"), false);
    recipeTable.column(22).visible($('#chk-recipe-show-rank-antique').prop("checked"), false);
    recipeTable.column(23).visible($('#chk-recipe-show-rank').prop("checked"), false);
    recipeTable.column(24).visible($('#chk-recipe-show-got').prop("checked"), false);

    var chkChefs = $('#chk-recipe-show-chef').val();
    for (var j = 0; j < data.chefs.length; j++) {
        recipeTable.column(25 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
        recipeTable.column(26 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
    }

    recipeTable.columns.adjust().draw(false);
}

function initChefShow(chefTable, data) {
    chefTable.column(0).visible($('#chk-chef-show-id').prop("checked"), false);
    chefTable.column(2).visible($('#chk-chef-show-rarity').prop("checked"), false);

    var chkSkill = $('#chk-chef-show-skill').prop("checked");
    chefTable.column(3).visible(chkSkill, false);
    chefTable.column(4).visible(chkSkill, false);
    chefTable.column(5).visible(chkSkill, false);
    chefTable.column(6).visible(chkSkill, false);
    chefTable.column(7).visible(chkSkill, false);
    chefTable.column(8).visible(chkSkill, false);
    chefTable.column(9).visible($('#chk-chef-show-chef-skill').prop("checked"), false);
    var chkExplore = $('#chk-chef-show-explore').prop("checked");
    chefTable.column(10).visible(chkExplore, false);
    chefTable.column(11).visible(chkExplore, false);
    chefTable.column(12).visible(chkExplore, false);
    chefTable.column(13).visible(chkExplore, false);
    chefTable.column(14).visible($('#chk-chef-show-gender').prop("checked"), false);
    chefTable.column(15).visible($('#chk-chef-show-origin').prop("checked"), false);

    if (private) {
        chefTable.column(16).visible($('#chk-chef-show-tags').prop("checked"), false);
    } else {
        chefTable.column(16).visible(false, false);
    }

    chefTable.column(17).visible($('#chk-chef-show-equip').prop("checked"), false);
    chefTable.column(18).visible($('#chk-chef-show-ultimate-goal').prop("checked"), false);
    chefTable.column(19).visible($('#chk-chef-show-ultimate-skill').prop("checked"), false);
    chefTable.column(20).visible($('#chk-chef-show-ultimate').prop("checked"), false);
    chefTable.column(21).visible($('#chk-chef-show-got').prop("checked"), false);

    var chkRecipes = $('#chk-chef-show-recipe').val();
    for (var j = 0; j < data.recipes.length; j++) {
        chefTable.column(22 + 2 * j).visible(chkRecipes.indexOf(j.toString()) > -1, false);
        chefTable.column(23 + 2 * j).visible(chkRecipes.indexOf(j.toString()) > -1, false);
    }

    chefTable.columns.adjust().draw(false);
}

function initEquipShow(equipTable) {
    equipTable.column(0).visible($('#chk-equip-show-id').prop("checked"), false);
    equipTable.column(2).visible($('#chk-equip-show-rarity').prop("checked"), false);
    equipTable.column(3).visible($('#chk-equip-show-skill').prop("checked"), false);
    equipTable.column(4).visible($('#chk-equip-show-origin').prop("checked"), false);

    equipTable.columns.adjust().draw(false);
}

function initCalRecipesShow(calRecipesTable) {
    calRecipesTable.column(1).visible($('#chk-cal-recipes-show-id').prop("checked"), false);
    calRecipesTable.column(3).visible($('#chk-cal-recipes-show-rarity').prop("checked"), false);

    var chkSkill = $('#chk-cal-recipes-show-skill').prop("checked");
    calRecipesTable.column(4).visible(chkSkill, false);
    calRecipesTable.column(5).visible(chkSkill, false);
    calRecipesTable.column(6).visible(chkSkill, false);
    calRecipesTable.column(7).visible(chkSkill, false);
    calRecipesTable.column(8).visible(chkSkill, false);
    calRecipesTable.column(9).visible(chkSkill, false);

    calRecipesTable.column(10).visible($('#chk-cal-recipes-show-material').prop("checked"), false);
    calRecipesTable.column(11).visible($('#chk-cal-recipes-show-price').prop("checked"), false);
    calRecipesTable.column(12).visible($('#chk-cal-recipes-show-limit').prop("checked"), false);
    calRecipesTable.column(13).visible($('#chk-cal-recipes-show-total-price').prop("checked"), false);
    calRecipesTable.column(14).visible($('#chk-cal-recipes-show-origin').prop("checked"), false);
    calRecipesTable.column(15).visible($('#chk-cal-recipes-show-tags').prop("checked"), false);

    calRecipesTable.columns.adjust().draw(false);
}

function initCalChefsShow(calChefsTable) {
    calChefsTable.column(1).visible($('#chk-cal-chefs-show-id').prop("checked"), false);
    calChefsTable.column(3).visible($('#chk-cal-chefs-show-rarity').prop("checked"), false);

    var chkSkill = $('#chk-cal-chefs-show-skill').prop("checked");
    calChefsTable.column(4).visible(chkSkill, false);
    calChefsTable.column(5).visible(chkSkill, false);
    calChefsTable.column(6).visible(chkSkill, false);
    calChefsTable.column(7).visible(chkSkill, false);
    calChefsTable.column(8).visible(chkSkill, false);
    calChefsTable.column(9).visible(chkSkill, false);

    calChefsTable.column(10).visible($('#chk-cal-chefs-show-chef-skill').prop("checked"), false);
    calChefsTable.column(11).visible($('#chk-cal-chefs-show-gender').prop("checked"), false);
    calChefsTable.column(12).visible($('#chk-cal-chefs-show-origin').prop("checked"), false);
    calChefsTable.column(13).visible($('#chk-cal-chefs-show-tags').prop("checked"), false);

    calChefsTable.columns.adjust().draw(false);
}

function initCalEquipsShow(calEquipsTable) {
    calEquipsTable.column(1).visible($('#chk-cal-equips-show-id').prop("checked"), false);
    calEquipsTable.column(3).visible($('#chk-cal-equips-show-rarity').prop("checked"), false);
    calEquipsTable.column(4).visible($('#chk-cal-equips-show-skill').prop("checked"), false);
    calEquipsTable.column(5).visible($('#chk-cal-equips-show-origin').prop("checked"), false);

    calEquipsTable.columns.adjust().draw(false);
}

function initCalMaterialsShow(calMaterialsTable) {
    calMaterialsTable.column(1).visible($('#chk-cal-materials-show-id').prop("checked"), false);
    calMaterialsTable.column(3).visible($('#chk-cal-materials-show-rarity').prop("checked"), false);
    calMaterialsTable.column(4).visible($('#chk-cal-materials-show-origin').prop("checked"), false);

    calMaterialsTable.columns.adjust().draw(false);
}

function initCalResultsShow(mode, calResultsTable, panel) {

    if (mode == "recipes") {

        panel.find('.chk-cal-results-show-chef-rarity').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-gender').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-skill').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-recipe-rank').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-equip').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-equip-addition').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-recipe-real-total-price').prop("checked", false).closest(".btn").addClass("hidden");

        calResultsTable.column(1).visible(false, false);    // chef name
        calResultsTable.column(22).visible(false, false);   // rank addition
        calResultsTable.column(23).visible(false, false);   // skill addition

    }

    calResultsTable.column(2).visible(panel.find('.chk-cal-results-show-chef-rarity').prop("checked"), false);
    calResultsTable.column(3).visible(panel.find('.chk-cal-results-show-chef-gender').prop("checked"), false);

    var chkChefSkill = panel.find('.chk-cal-results-show-chef-skill').prop("checked");
    calResultsTable.column(4).visible(chkChefSkill, false);
    calResultsTable.column(5).visible(chkChefSkill, false);
    calResultsTable.column(6).visible(chkChefSkill, false);
    calResultsTable.column(7).visible(chkChefSkill, false);
    calResultsTable.column(8).visible(chkChefSkill, false);
    calResultsTable.column(9).visible(chkChefSkill, false);

    calResultsTable.column(11).visible(panel.find('.chk-cal-results-show-recipe-rarity').prop("checked"), false);

    var chkRecipeSkill = panel.find('.chk-cal-results-show-recipe-skill').prop("checked");
    calResultsTable.column(12).visible(chkRecipeSkill, false);
    calResultsTable.column(13).visible(chkRecipeSkill, false);
    calResultsTable.column(14).visible(chkRecipeSkill, false);
    calResultsTable.column(15).visible(chkRecipeSkill, false);
    calResultsTable.column(16).visible(chkRecipeSkill, false);
    calResultsTable.column(17).visible(chkRecipeSkill, false);

    calResultsTable.column(18).visible(panel.find('.chk-cal-results-show-recipe-material').prop("checked"), false);
    calResultsTable.column(21).visible(panel.find('.chk-cal-results-show-recipe-rank').prop("checked"), false);
    calResultsTable.column(24).visible(panel.find('.chk-cal-results-show-chef-equip').prop("checked"), false);
    calResultsTable.column(25).visible(panel.find('.chk-cal-results-show-chef-equip-addition').prop("checked"), false);
    calResultsTable.column(26).visible(panel.find('.chk-cal-results-show-bonus-addition').prop("checked"), false);
    calResultsTable.column(27).visible(panel.find('.chk-cal-results-show-ultimate-addition').prop("checked"), false);
    calResultsTable.column(28).visible(panel.find('.chk-cal-results-show-recipe-total-price').prop("checked"), false);
    calResultsTable.column(29).visible(panel.find('.chk-cal-results-show-recipe-real-total-price').prop("checked"), false);
    calResultsTable.column(30).visible(panel.find('.chk-cal-results-show-bonus-score').prop("checked"), false);

    calResultsTable.columns.adjust().draw(false);
}

function initInfo(data) {
    $('#pagination-history').pagination({
        dataSource: data.history,
        callback: function (data, pagination) {
            var html = historyTemplate(data);
            $('#data-history').html(html);
        },
        pageSize: 10,
        showPageNumbers: false,
        showNavigator: true,
        showPrevious: true,
        showNext: true
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

$.fn.dataTable.Api.register('MakeCellsEditable()', function (settings) {
    var table = this.table();

    $.fn.extend({
        // UPDATE
        updateEditableCell: function (callingElement, settings) {
            var table = $(callingElement).closest("table").DataTable().table();
            var row = table.row($(callingElement).parents('tr'));
            var cell = table.cell($(callingElement).closest("td"));
            var inputField = $(callingElement);

            // Update
            var oldValue = cell.data();
            var newValue = inputField.val();
            cell.data(newValue);
            if (settings.onUpdate) {
                settings.onUpdate(table, row, cell, oldValue);
            }
        }
    });

    // Destroy
    if (settings === "destroy") {
        $(table.body()).off("click", "td");
        table = null;
    }

    if (table != null) {
        // On cell click
        $(table.body()).on('click', 'td', function () {
            if ($(table.body()).hasClass("processing")) {
                return;
            }

            var currentColumnIndex = table.cell(this).index().column;

            // DETERMINE WHAT COLUMNS CAN BE EDITED
            if ((settings.columns && settings.columns.indexOf(currentColumnIndex) > -1) || (!settings.columns)) {

                var cell = table.cell(this).node();
                var oldValue = table.cell(this).data();
                // Sanitize value
                oldValue = sanitizeCellValue(oldValue);

                // Show input
                if (!$(cell).find('input').length && !$(cell).find('select').length) {

                    if (settings.waitUpdate) {
                        $(table.body()).addClass("processing");
                    }

                    // Input CSS
                    var input = getInputHtml(currentColumnIndex, settings, oldValue);
                    $(cell).html(input.html);
                    if (input.type == "input") {
                        $(cell).find("input").select().focus().on('focusout', function () {
                            $(this).updateEditableCell(this, settings);
                        });
                    } else if (input.type == "list") {
                        $(cell).find("select").selectpicker('toggle').on('hidden.bs.select', function (e) {
                            $(this).updateEditableCell(this, settings);
                        });;
                    }
                }
            }
        });
    }

});

function getInputHtml(currentColumnIndex, settings, oldValue) {
    var inputSetting, inputType, input;

    input = { "type": "input", "html": null }

    if (settings.inputTypes) {
        $.each(settings.inputTypes, function (index, setting) {
            if (setting.column == currentColumnIndex) {
                inputSetting = setting;
                inputType = inputSetting.type.toLowerCase();
            }
        });
    }

    switch (inputType) {
        case "list":
            var searchable = "data-live-search='false'";
            if (inputSetting.search) {
                searchable = "data-live-search='true'";
            }
            input.html = "<select " + searchable + " data-width='fit' data-dropdown-align-right='auto' data-live-search-placeholder='查找' data-none-results-text='没有找到' data-none-selected-text=''>";
            $.each(inputSetting.options, function (index, option) {
                input.html = input.html + "<option value='" + option.value + "'";
                if (option.tokens) {
                    input.html += " data-tokens='" + option.tokens + "'";
                }
                if (option.subtext) {
                    input.html += " data-subtext='" + option.subtext + "'";
                }
                if (oldValue == option.value) {
                    input.html += " selected";
                }
                input.html += ">" + option.display + "</option>"
            });
            input.html = input.html + "</select>";
            input.type = inputType;
            break;
        default: // text input
            input.html = "<input class='form-control' value='" + oldValue + "'></input>";
            break;
    }
    return input;
}

function sanitizeCellValue(cellValue) {
    if (typeof (cellValue) === 'undefined' || cellValue === null || cellValue.length < 1) {
        return "";
    }

    // If not a number
    if (isNaN(cellValue)) {
        // escape single quote
        cellValue = cellValue.replace(/'/g, "&#39;");
    }
    return cellValue;
}
