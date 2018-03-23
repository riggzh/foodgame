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
    var private = false;
    var cal = false;
    if (window.location.search) {
        if (lcode(window.location.search) == "0d9753e2fe5a15db2668f70016e565ca7d717c67278ea6c689881ac4") {
            private = true;
        }
        if (lcode(window.location.search) == "12efa26026978758fbbbd57a70747902dba7f1a434d8dbb8cde98373") {
            cal = true;
        }
    }
    var data = generateData(json, private);

    initRecipeTable(data, private);

    initChefTable(data);

    initKitchenwareTable(data);

    initQuestTable(data);

    if (private || cal) {
        initCalTables(json, data);
        $(".nav-tabs li").removeClass("hidden");
    }

    initInfo(data);

    $('.loading').addClass("hidden");
    $('.main-function').removeClass("hidden");
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
                "_": "ingredientsVal",
                "display": "ingredientsDisp"
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
            "data": "limit"
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
            "data": "ingredientsEff"
        },
        {
            "data": "origin"
        },
        {
            "data": "unlock"
        },
        {
            "data": "guestsDisp"
        },
        {
            "data": {
                "_": "levelGuestsVal",
                "display": "levelGuestsDisp"
            }
        },
        {
            "data": "godRune"
        },
        {
            "data": "quality"
        }
    ];

    for (var j in data.chefs) {
        $('#chk-recipe-show-chef').append("<option value='" + j + "'>" + data.chefs[j].name + "</option>");
        $('#recipe-table thead tr').append("<th>" + data.chefs[j].name + "</th>").append("<th>效率</th>");

        recipeColumns.push({
            "data": {
                "_": "chefs." + j + ".qualityVal",
                "display": "chefs." + j + ".qualityDisp"
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
            "<'row'<'col-sm-12'p>>"
    });

    $("#pane-recipes div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="菜名 材料 贵客 符文"></label>');

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
            || $('#chk-recipe-skill-cut').prop("checked") && (Math.floor(data[5]) || 0) > 0
            || $('#chk-recipe-skill-fry').prop("checked") && (Math.floor(data[6]) || 0) > 0
            || $('#chk-recipe-skill-roast').prop("checked") && (Math.floor(data[7]) || 0) > 0
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
        var guest = data[19];

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

        var value = $("#input-recipe-guest-rune").val();
        var searchCols = [20, 21];  // level guest, level rune

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

        var value = $("#pane-recipes .search-box input").val();
        var searchCols = [0, 1, 9, 19]; // id, name, ingredients, guest

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('#chk-recipe-show-chef').selectpicker().on('changed.bs.select', function () {
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

    $('#input-recipe-guest-rune').keyup(function () {
        if (!$('#chk-recipe-show-level-guest').prop("checked")) {
            $('#chk-recipe-show-level-guest').prop("checked", true);
            initRecipeShow(recipeTable, data, private);
        }
        recipeTable.draw();
    });

    $('#chk-recipe-guest').click(function () {
        recipeTable.draw();
    });

    $('#pane-recipes .search-box input').keyup(function () {
        recipeTable.draw();
    });


    if (private) {
        $('#chk-recipe-show-origin').prop("checked", false);
        $('#chk-recipe-show-unlock').prop("checked", false);
        $('#chk-recipe-show-quality').prop("checked", true).parent(".btn").removeClass('hidden');
    }

    initRecipeShow(recipeTable, data, private);
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
                "_": "specialSkillVal",
                "display": "specialSkillDisp"
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

    for (var j in data.recipes) {
        $('#chk-chef-show-recipe').append("<option value='" + j + "'>" + data.recipes[j].name + "</option>");
        $('#chef-table thead tr').append("<th>" + data.recipes[j].name + "</th>");

        chefColumns.push({
            "data": {
                "_": "recipes." + j + ".qualityVal",
                "display": "recipes." + j + ".qualityDisp"
            }
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
            "<'row'<'col-sm-12'p>>"
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
        var cutMin = Math.floor($('#input-chef-cut').val());
        var cut = Math.floor(data[5]) || 0;
        var fryMin = Math.floor($('#input-chef-fry').val());
        var fry = Math.floor(data[6]) || 0;
        var roastMin = Math.floor($('#input-chef-roast').val());
        var roast = Math.floor(data[7]) || 0;
        var steamMin = Math.floor($('#input-chef-steam').val());
        var steam = Math.floor(data[8]) || 0;

        if (stirfryMin <= stirfry && boilMin <= boil && cutMin <= cut && fryMin <= fry && roastMin <= roast && steamMin <= steam) {
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

        if (chkMale && sex == "男" || chkFemale && sex == "女") {
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
        var searchCols = [1, 9, 15];    //  name, skill, origin

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('#chk-chef-show-recipe').selectpicker().on('changed.bs.select', function () {
        initChefShow(chefTable, data);
    });

    $('.chk-chef-show').click(function () {
        initChefShow(chefTable, data);
    });

    $('#chk-chef-show-all').click(function () {
        if ($('.chk-chef-show:checked').length == $('.chk-chef-show').length) {
            $('.chk-chef-show').prop("checked", false);
        }
        else {
            $('.chk-chef-show').prop("checked", true);
        }
        initChefShow(chefTable, data);
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

    $('.chk-chef-sex input[type="checkbox"]').click(function () {
        chefTable.draw();
    });

    $('#pane-chefs .search-box input').keyup(function () {
        chefTable.draw();
    });

    initChefShow(chefTable, data);
}

function initKitchenwareTable(data) {
    var kitchenwareColumns = [
        {
            "data": "kitchenwareId"
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
                "_": "skillVal",
                "display": "skillDisp"
            }
        },
        {
            "data": "origin"
        }
    ];

    var kitchenwareTable = $('#kitchenware-table').DataTable({
        data: data.kitchenware,
        columns: kitchenwareColumns,
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
            "<'row'<'col-sm-12'p>>"
    });

    $("#pane-kitchenware div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 技能 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('kitchenware-table')) {
            return true;
        }

        var skill = data[3];    // skill

        if ($('#chk-kitchenware-skill-stirfry-price').prop("checked") && skill.indexOf("炒类料理") >= 0
            || $('#chk-kitchenware-skill-boil-price').prop("checked") && skill.indexOf("煮类料理") >= 0
            || $('#chk-kitchenware-skill-cut-price').prop("checked") && skill.indexOf("切类料理") >= 0
            || $('#chk-kitchenware-skill-fry-price').prop("checked") && skill.indexOf("炸类料理") >= 0
            || $('#chk-kitchenware-skill-roast-price').prop("checked") && skill.indexOf("烤类料理") >= 0
            || $('#chk-kitchenware-skill-steam-price').prop("checked") && skill.indexOf("蒸类料理") >= 0
            || $('#chk-kitchenware-skill-meet-price').prop("checked") && skill.indexOf("肉类料理") >= 0
            || $('#chk-kitchenware-skill-wheat-price').prop("checked") && skill.indexOf("面类料理") >= 0
            || $('#chk-kitchenware-skill-veg-price').prop("checked") && skill.indexOf("蔬菜料理") >= 0
            || $('#chk-kitchenware-skill-fish-price').prop("checked") && skill.indexOf("水产料理") >= 0
            || $('#chk-kitchenware-skill-sell-price').prop("checked") && skill.indexOf("金币获得") >= 0
            || $('#chk-kitchenware-skill-stirfry-skill').prop("checked") && skill.indexOf("炒技法") >= 0
            || $('#chk-kitchenware-skill-boil-skill').prop("checked") && skill.indexOf("煮技法") >= 0
            || $('#chk-kitchenware-skill-cut-skill').prop("checked") && skill.indexOf("切技法") >= 0
            || $('#chk-kitchenware-skill-fry-skill').prop("checked") && skill.indexOf("炸技法") >= 0
            || $('#chk-kitchenware-skill-roast-skill').prop("checked") && skill.indexOf("烤技法") >= 0
            || $('#chk-kitchenware-skill-steam-skill').prop("checked") && skill.indexOf("蒸技法") >= 0
            || $('#chk-kitchenware-skill-all-skill').prop("checked") && skill.indexOf("全技法") >= 0
            || $('#chk-kitchenware-skill-guest').prop("checked") && skill.indexOf("稀有客人") >= 0
            || $('#chk-kitchenware-skill-time').prop("checked") && skill.indexOf("开业时间") >= 0
            || $('#chk-kitchenware-skill-ingredient-get').prop("checked") && skill.indexOf("素材获得") >= 0
            || $('#chk-kitchenware-skill-meet-skill').prop("checked") && skill.indexOf("肉类采集") >= 0
            || $('#chk-kitchenware-skill-wheat-skill').prop("checked") && skill.indexOf("面类采集") >= 0
            || $('#chk-kitchenware-skill-veg-skill').prop("checked") && skill.indexOf("蔬菜采集") >= 0
            || $('#chk-kitchenware-skill-fish-skill').prop("checked") && skill.indexOf("水产采集") >= 0
            || $('#chk-kitchenware-skill-ingredient-skill').prop("checked") && skill.indexOf("全采集") >= 0
        ) {
            return true;
        }
        else {
            return false;
        }
    });

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('kitchenware-table')) {
            return true;
        }

        var value = $("#pane-kitchenware .search-box input").val();
        var searchCols = [1, 3, 4];    // name, skill, origin

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    $('.chk-kitchenware-show').click(function () {
        initKitchenwareShow(kitchenwareTable);
    });

    $('#chk-kitchenware-show-all').click(function () {
        if ($('.chk-kitchenware-show:checked').length == $('.chk-kitchenware-show').length) {
            $('.chk-kitchenware-show').prop("checked", false);
        }
        else {
            $('.chk-kitchenware-show').prop("checked", true);
        }
        initKitchenwareShow(kitchenwareTable);
    });

    $('.chk-kitchenware-skill').click(function () {
        if ($(this).prop("checked")) {
            if ($('#chk-kitchenware-single-skill').prop("checked")) {
                $(".chk-kitchenware-skill").not(this).prop("checked", false);
            }
        }
        kitchenwareTable.draw();
    });

    $('#chk-kitchenware-single-skill').change(function () {
        if ($(this).prop("checked")) {
            if ($('.chk-kitchenware-skill:checked').length > 1) {
                $('.chk-kitchenware-skill').prop("checked", false);
                kitchenwareTable.draw();
            }
        }
    });

    $('#chk-kitchenware-skill-all').click(function () {
        if ($('#chk-kitchenware-single-skill').prop("checked")) {
            $('#chk-kitchenware-single-skill').bootstrapToggle('off')
        }
        $(".chk-kitchenware-skill").prop("checked", true);
        kitchenwareTable.draw();
    });

    $('#pane-kitchenware .search-box input').keyup(function () {
        kitchenwareTable.draw();
    });

    initKitchenwareShow(kitchenwareTable);
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
            "<'row'<'col-sm-12'p>>"
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

function initCalTables(json, data) {

    initCalRules(data);
    initCalRecipesTable(data);
    initCalChefsTable(data);
    initCalIngredientsTable(data);

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
            $('#cal-recipes-table').DataTable().clear().rows.add(event.data.recipes).draw(false);
            $('#cal-recipes-table').DataTable().rows().select();

            $('#cal-chefs-table').DataTable().clear().rows.add(event.data.chefs).draw(false);
            $('#cal-chefs-table').DataTable().rows().select();

            $('#cal-ingredients-table').DataTable().clear().rows.add(event.data.ingredients).draw(false);
            $('#cal-ingredients-table').DataTable().rows().select();

            var customWorker;

            var chefsOptions = getChefsOptions(event.data.chefs);
            var recipesOptions = getRecipesOptions(event.data.recipes);
            var kitchenwareOptions = getKitchenwareOptions(data.kitchenware);

            $('#cal-self-select-table').DataTable().MakeCellsEditable("destroy");

            $('#cal-self-select-table').DataTable().MakeCellsEditable({
                "columns": [1, 10, 20, 24],  // chef name, recipe name, quantity, kitchenware
                "inputTypes": [
                    {
                        "column": 1,
                        "type": "list",
                        "options": chefsOptions
                    },
                    {
                        "column": 10,
                        "type": "list",
                        "options": recipesOptions
                    },
                    {
                        "column": 24,
                        "type": "list",
                        "options": kitchenwareOptions
                    }
                ],
                "onUpdate": function updateSelfSelectTable(table, row, cell) {

                    if (typeof (customWorker) != "undefined") {
                        customWorker.terminate();
                        customWorker = undefined;
                    }

                    customWorker = new Worker("js/cal.js");
                    customWorker.onmessage = function (cevent) {
                        table.clear().rows.add(cevent.data).draw(false);
                        $(table.body()).removeClass("processing");
                    }

                    var calRecipesData = $('#cal-recipes-table').DataTable().data().toArray();
                    var calChefsData = $('#cal-chefs-table').DataTable().data().toArray();
                    var calIngredientsData = $('#cal-ingredients-table').DataTable().data().toArray();

                    var currentData = table.data().toArray();

                    customWorker.postMessage({
                        "mode": "custom",
                        "rule": rule,
                        "recipes": calRecipesData,
                        "chefs": calChefsData,
                        "ingredients": calIngredientsData,
                        "kitchenware": data.kitchenware,
                        "custom": currentData
                    });
                },
                "waitUpdate": true
            });

            $("#pane-cal-rules .cal-results-progress").addClass("hidden");
            $("#btn-cal-rule-load").prop("disabled", false);
        };

        ruleWorker.postMessage({
            "mode": "get-rules-data",
            "rule": rule,
            "data": data
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
                "_": "ingredientsVal",
                "display": "ingredientsDisp"
            }
        },
        {
            "data": "price"
        },
        {
            "data": "limit"
        },
        {
            "data": "totalPrice"
        },
        {
            "data": "origin"
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
        var searchCols = [2, 10];    //name, ingredients

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    calRecipesTable.MakeCellsEditable({
        "columns": [15]  // addition
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
                "_": "specialSkillVal",
                "display": "specialSkillDisp"
            }
        },
        {
            "data": "sex"
        },
        {
            "data": "origin"
        },
        {
            "data": "addition",
            "className": "cal-td-input-addition",
            "width": "38px"
        },
        {
            "data": "kitchenwareName",
            "className": "cal-td-select-kitchenware",
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
        var searchCols = [2, 11];   //name sex

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    var options = getKitchenwareOptions(data.kitchenware);
    calChefsTable.MakeCellsEditable({
        "columns": [13, 14],  // addition
        "inputTypes": [
            {
                "column": 14,
                "type": "list",
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

    $("#btn-cal-chefs-kitchenware-clear").click(function () {
        calChefsTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
            this.cell(rowIdx, '.cal-td-select-kitchenware').data("");
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

function initCalIngredientsTable(data) {
    var calIngredientsColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": "ingredientId"
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
            "data": "addition",
            "className": "cal-td-input-addition",
            "width": "38px"
        }
    ];

    var calIngredientsTable = $('#cal-ingredients-table').DataTable({
        data: new Array(),
        columns: calIngredientsColumns,
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

    $("#pane-cal-ingredients div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="名字 来源"></label>');

    $.fn.dataTableExt.afnFiltering.push(function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-ingredients-table')) {
            return true;
        }

        var value = $("#pane-cal-ingredients .search-box input").val();
        var searchCols = [2, 4];   //name, origin

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    });

    calIngredientsTable.MakeCellsEditable({
        "columns": [5]  // addition
    });

    $('.chk-cal-ingredients-show').click(function () {
        initCalIngredientsShow(calIngredientsTable);
    });

    $('.chk-cal-ingredients-origin input[type="checkbox"]').click(function () {
        var origin = $(this).attr("data-origin");
        if ($(this).prop("checked")) {
            calIngredientsTable.rows('.origin-' + origin).select();
        } else {
            calIngredientsTable.rows('.origin-' + origin).deselect();
        }
    });

    $('#pane-cal-ingredients .search-box input').keyup(function () {
        calIngredientsTable.draw();
    });

    $('#btn-cal-ingredients-select-all').click(function () {
        $('.chk-cal-ingredients-origin input[type="checkbox"]').prop("checked", true);
        calIngredientsTable.rows().select();
    });

    $('#btn-cal-ingredients-deselect-all').click(function () {
        $('.chk-cal-ingredients-origin input[type="checkbox"]').prop("checked", false);
        calIngredientsTable.rows().deselect();
    });

    initCalIngredientsShow(calIngredientsTable);
}

function initCalResultsTable(data) {

    $("#cal-recipes-results-place").html($("#pane-cal-results-common").html());
    $("#cal-recipes-results-place .cal-results-table").prop("id", "cal-recipes-results-table");
    $('#cal-recipes-results-place .chk-cal-results-show-selected').bootstrapToggle();

    $("#cal-all-results-place").html($("#pane-cal-results-common").html());
    $("#cal-all-results-place .cal-results-table").prop("id", "cal-all-results-table");
    $('#cal-all-results-place .chk-cal-results-show-selected').bootstrapToggle();

    $("#cal-optimal-results-place").html($("#pane-cal-results-common").html());
    $("#cal-optimal-results-place .cal-results-table").prop("id", "cal-optimal-results-table");
    $("#cal-optimal-results-place .chk-cal-results-show-selected").remove();

    initCalResultTableCommon("recipes", new Array(), $("#pane-cal-recipes-results"));
    initCalResultTableCommon("all", new Array(), $("#pane-cal-all-results"));
    initCalResultTableCommon("optimal", new Array(), $("#pane-cal-optimal-results"));

    var calRecipesWorker, calAllWorker, calOptimalWorker;

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
                    $("#cal-all-results-table").DataTable().clear().rows.add(event.data.menu).draw(false);
                } else if (mode == "optimal") {
                    $("#cal-optimal-results-table").DataTable().clear().rows.add(event.data.menu).draw(false);
                    $("#cal-optimal-results-table").DataTable().rows().select();
                } else if (mode == "recipes") {
                    panel.find('.chk-cal-results-show-selected').prop("checked", false);
                    $("#cal-recipes-results-table").DataTable().clear().rows.add(event.data.menu).draw(false);
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
        var calIngredientsData = $('#cal-ingredients-table').DataTable().rows({ selected: true }).data().toArray();
        var allLimit = Math.floor($("#input-cal-all-results-show-top").val());

        worker.postMessage({
            "mode": mode,
            "rule": rule,
            "recipes": calRecipesData,
            "chefs": calChefsData,
            "ingredients": calIngredientsData,
            "kitchenware": data.kitchenware,
            "allLimit": allLimit
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
            "data": "chef.sex",
            "defaultContent": ""
        },
        {
            "data": "chef.stirfry",
            "defaultContent": ""
        },
        {
            "data": "chef.boil",
            "defaultContent": ""
        },
        {
            "data": "chef.cut",
            "defaultContent": ""
        },
        {
            "data": "chef.fry",
            "defaultContent": ""
        },
        {
            "data": "chef.roast",
            "defaultContent": ""
        },
        {
            "data": "chef.steam",
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
            "data": "recipe.data.cut",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.fry",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.roast",
            "defaultContent": ""
        },
        {
            "data": "recipe.data.steam",
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.data.ingredientsVal",
                "display": "recipe.data.ingredientsDisp"
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
                "_": "recipe.qualityVal",
                "display": "recipe.qualityDisp"
            },
            "defaultContent": ""
        },
        {
            "data": {
                "_": "recipe.qualityAddition",
                "display": "recipe.qualityAdditionDisp"
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
            "data": "kitchenware.disp",
            "className": "cal-td-kitchenware-name",
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
                "_": "recipe.otherAddition",
                "display": "recipe.otherAdditionDisp"
            },
            "defaultContent": ""
        },
        {
            "data": "recipe.totalPrice",
            "defaultContent": ""
        },
        {
            "data": "recipe.realTotalPrice",
            "defaultContent": ""
        },
        {
            "data": "recipe.bonusScore",
            "defaultContent": ""
        },
        {
            "data": "recipe.totalScore",
            "defaultContent": ""
        }
    ];

    var paging = true;
    if (mode == "optimal" || mode == "self-select") {
        paging = false;
    }

    var order = [[30, "desc"]]  //score
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

            var totalPrice = dt.cells(selectedRows, 27).data().reduce(function (a, b) { return a + b; }, 0);    //totalPrice
            var sumText = "原售价：" + totalPrice;

            if (mode == "all" || mode == "optimal" || mode == "self-select") {
                var realTotalPrice = dt.cells(selectedRows, 28).data().reduce(function (a, b) { return a + b; }, 0);    //realTotalPrice
                sumText += " 实售价：" + realTotalPrice;
            }

            var bonusScore = dt.cells(selectedRows, 29).data().reduce(function (a, b) { return a + b; }, 0);    //bonusScore
            sumText += " 规则分：" + bonusScore;

            var totalScore = dt.cells(selectedRows, 30).data().reduce(function (a, b) { return a + b; }, 0);    //totalScore
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
            var searchCols = [1, 10, 18];   //chefname, recipename, ingredients

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
            var searchCols = [1, 10, 18];   //chefname, recipename, ingredients

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

    $("#cal-self-select-place .chk-cal-results-show-chef-kitchenware").prop("checked", true);

    var selfSelectData = new Array();
    for (var i = 0; i < 9; i++) {
        var oneMenu = new Object();
        oneMenu["chef"] = new Object();
        oneMenu["recipe"] = new Object();
        oneMenu["recipe"]["data"] = new Object();
        oneMenu["kitchenware"] = new Object();
        selfSelectData.push(oneMenu);
    }
    var table = initCalResultTableCommon("self-select", selfSelectData, $("#pane-cal-self-select"));

    $("#pane-cal-self-select").find(".cal-results-wrapper").removeClass("hidden");

}

function generateData(json, private) {
    var retData = new Object();

    retData["history"] = json.history;

    var ingredientsData = new Array();
    for (var i in json.ingredients) {
        var ingredientData = json.ingredients[i];
        ingredientData["rarityDisp"] = getRarityDisp(json.ingredients[i].rarity);
        ingredientData["originVal"] = getOriginVal(json.ingredients[i].origin);
        ingredientData["addition"] = "";
        ingredientsData.push(ingredientData);
    }
    retData["ingredients"] = ingredientsData;

    var kitchenwareData = new Array();
    for (var i in json.kitchenware) {

        if (!json.kitchenware[i].name) {
            continue;
        }

        var kitchenware = json.kitchenware[i];
        kitchenware["rarityDisp"] = getRarityDisp(json.kitchenware[i].rarity);
        kitchenware["cal"] = isCalKitchenware(json.kitchenware[i].skill);
        var skillInfo = getSkillInfo(json.kitchenware[i].skill);
        kitchenware["skillVal"] = skillInfo.skillVal;
        kitchenware["skillDisp"] = skillInfo.skillDisp;

        kitchenwareData.push(kitchenware);
    }
    retData["kitchenware"] = kitchenwareData;

    var questsData = new Array();
    for (var i in json.quests) {

        if (json.quests[i].questId > 400) {
            continue;
        }

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

    var chefsData = new Array();
    for (var i in json.chefs) {

        if (!json.chefs[i].name) {
            continue;
        }

        var chefData = json.chefs[i];
        chefData["recipes"] = new Array();

        chefData["stirfry"] = json.chefs[i].stirfry || "";
        chefData["boil"] = json.chefs[i].boil || "";
        chefData["cut"] = json.chefs[i].cut || "";
        chefData["fry"] = json.chefs[i].fry || "";
        chefData["roast"] = json.chefs[i].roast || "";
        chefData["steam"] = json.chefs[i].steam || "";
        chefData["meat"] = json.chefs[i].meat || "";
        chefData["wheat"] = json.chefs[i].wheat || "";
        chefData["veg"] = json.chefs[i].veg || "";
        chefData["fish"] = json.chefs[i].fish || "";
        chefData["addition"] = "";
        chefData["kitchenwareName"] = "";

        chefData["chefIdDisp"] = json.chefs[i].chefId + " - " + (json.chefs[i].chefId + 2);
        chefData["rarityDisp"] = getRarityDisp(json.chefs[i].rarity);

        var skillInfo = getSkillInfo(json.chefs[i].skill);
        chefData["specialSkillVal"] = skillInfo.skillVal;
        chefData["specialSkillDisp"] = skillInfo.skillDisp;

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
        recipeData["cut"] = json.recipes[i].cut || "";
        recipeData["fry"] = json.recipes[i].fry || "";
        recipeData["roast"] = json.recipes[i].roast || "";
        recipeData["steam"] = json.recipes[i].steam || "";
        recipeData["price"] = json.recipes[i].price || "";
        recipeData["limit"] = json.recipes[i].limit || "";
        recipeData["addition"] = "";

        recipeData["timeDisp"] = secondsToTime(json.recipes[i].time);
        recipeData["rarityDisp"] = getRarityDisp(json.recipes[i].rarity);

        var totalPrice = 0;
        var totalTime = 0;
        var efficiency = 0;

        if (json.recipes[i].price > 0 && json.recipes[i].time > 0) {

            efficiency = json.recipes[i].price * 3600 / json.recipes[i].time;

            if (json.recipes[i].limit > 0) {
                totalPrice = json.recipes[i].price * json.recipes[i].limit;
                totalTime = json.recipes[i].time * json.recipes[i].limit;
            }
        }

        recipeData["totalPrice"] = totalPrice ? totalPrice : "";
        recipeData["totalTime"] = totalTime;
        recipeData["totalTimeDisp"] = secondsToTime(totalTime);
        recipeData["efficiency"] = efficiency ? Math.floor(efficiency) : "";

        var ingredientsInfo = getIngredientsInfo(json.recipes[i]);
        recipeData["ingredientsVal"] = ingredientsInfo.ingredientsVal;
        recipeData["ingredientsDisp"] = ingredientsInfo.ingredientsDisp;

        var ingredientsEff = 0;
        if (json.recipes[i].time > 0) {
            ingredientsEff = ingredientsInfo.ingredientsCount * 3600 / json.recipes[i].time;
        }
        recipeData["ingredientsEff"] = ingredientsEff ? Math.floor(ingredientsEff) : "";

        var levelGuestsDisp = "";
        var levelGuestsVal = "";
        for (g in json.recipes[i].guests) {
            if (json.recipes[i].guests[g].guest) {
                if (private) {
                    if (json.recipes[i].quality == "优" && json.recipes[i].guests[g].quality == "优"
                        || json.recipes[i].quality == "特" && json.recipes[i].guests[g].quality != "神"
                        || json.recipes[i].quality == "神") {
                        continue;
                    }
                }
                levelGuestsDisp += json.recipes[i].guests[g].quality + "-" + json.recipes[i].guests[g].guest + "<br>";
                levelGuestsVal += json.recipes[i].guests[g].guest;
            }
        }
        recipeData["levelGuestsVal"] = levelGuestsVal;
        recipeData["levelGuestsDisp"] = levelGuestsDisp;

        var guests = "";
        for (var m in json.guests) {
            for (var n in json.guests[m].gifts) {
                if (json.recipes[i].name == json.guests[m].gifts[n].recipe) {
                    guests += json.guests[m].name + "-" + json.guests[m].gifts[n].rune + "<br>";
                    break;
                }
            }
        }
        recipeData["guestsDisp"] = guests;

        recipeData["chefs"] = new Array();
        for (var j in retData["chefs"]) {

            var qualityInfo = getQualityInfo(json.recipes[i], retData["chefs"][j]);

            var chefEff = 0;

            if (qualityInfo.qualityVal > 0) {

                var skillAddition = getSkillAddition(json.recipes[i], retData["chefs"][j].skill, retData["ingredients"]);

                if (efficiency > 0) {
                    chefEff = (1 + qualityInfo.qualityAddition + skillAddition) * efficiency;
                }
            }

            var recipeChefData = new Object();
            recipeChefData["qualityVal"] = qualityInfo.qualityVal;
            recipeChefData["qualityDisp"] = qualityInfo.qualityDisp;
            recipeChefData["efficiency"] = Math.floor(chefEff) || "";
            recipeData["chefs"].push(recipeChefData);

            var chefRecipeData = new Object();
            chefRecipeData["qualityVal"] = qualityInfo.qualityVal;
            chefRecipeData["qualityDisp"] = qualityInfo.qualityDisp;
            retData["chefs"][j]["recipes"].push(chefRecipeData);
        }

        recipesData.push(recipeData);
    }

    retData["recipes"] = recipesData;

    return retData;
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

function getIngredientsInfo(recipe) {
    var ingredientsInfo = new Object();
    var ingredientsDisp = "";
    var ingredientsVal = "";
    var ingredientsCount = 0;

    for (var k in recipe.ingredients) {
        if (recipe.ingredients[k].name) {
            ingredientsDisp += recipe.ingredients[k].name + "*" + recipe.ingredients[k].quantity + " ";
            ingredientsVal += recipe.ingredients[k].name;
            ingredientsCount += recipe.ingredients[k].quantity;
        }
    }
    ingredientsInfo["ingredientsDisp"] = ingredientsDisp;
    ingredientsInfo["ingredientsVal"] = ingredientsVal;
    ingredientsInfo["ingredientsCount"] = ingredientsCount;
    return ingredientsInfo;
}

function getRarityDisp(rarity) {
    var rarityDisp = "";
    for (var j = 0; j < rarity; j++) {
        rarityDisp += "&#x2605;";
    }
    return rarityDisp;
}

function isCalKitchenware(skill) {
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

function getKitchenwareOptions(kitchenware) {
    var list = new Array();
    var option = new Object();
    option["display"] = "无厨具";
    option["subtext"] = "";
    option["tokens"] = "";
    option["value"] = "";
    list.push(option);
    for (var i in kitchenware) {
        var skillInfo = getSkillInfo(kitchenware[i].skill);
        var skillDisp = skillInfo.skillDisp.replace("<br>", " ");
        var option = new Object();
        option["display"] = kitchenware[i].name;
        option["subtext"] = skillDisp;
        option["tokens"] = kitchenware[i].name + skillDisp;
        option["value"] = kitchenware[i].name;
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

function initRecipeShow(recipeTable, data, private) {
    recipeTable.column(0).visible($('#chk-recipe-show-id').prop("checked"), false);
    recipeTable.column(2).visible($('#chk-recipe-show-rarity').prop("checked"), false);

    var chkSkill = $('#chk-recipe-show-skill').prop("checked");
    recipeTable.column(3).visible(chkSkill, false);
    recipeTable.column(4).visible(chkSkill, false);
    recipeTable.column(5).visible(chkSkill, false);
    recipeTable.column(6).visible(chkSkill, false);
    recipeTable.column(7).visible(chkSkill, false);
    recipeTable.column(8).visible(chkSkill, false);
    recipeTable.column(9).visible($('#chk-recipe-show-ingredients').prop("checked"), false);
    recipeTable.column(10).visible($('#chk-recipe-show-price').prop("checked"), false);
    recipeTable.column(11).visible($('#chk-recipe-show-time').prop("checked"), false);
    recipeTable.column(12).visible($('#chk-recipe-show-limit').prop("checked"), false);
    recipeTable.column(13).visible($('#chk-recipe-show-total-price').prop("checked"), false);
    recipeTable.column(14).visible($('#chk-recipe-show-total-time').prop("checked"), false);
    recipeTable.column(15).visible($('#chk-recipe-show-efficiency').prop("checked"), false);
    recipeTable.column(16).visible($('#chk-recipe-show-ingredients-efficiency').prop("checked"), false);
    recipeTable.column(17).visible($('#chk-recipe-show-origin').prop("checked"), false);
    recipeTable.column(18).visible($('#chk-recipe-show-unlock').prop("checked"), false);
    recipeTable.column(19).visible($('#chk-recipe-show-guest').prop("checked"), false);
    recipeTable.column(20).visible($('#chk-recipe-show-level-guest').prop("checked"), false);
    recipeTable.column(21).visible($('#chk-recipe-show-god-rune').prop("checked"), false);

    if (private) {
        recipeTable.column(22).visible($('#chk-recipe-show-quality').prop("checked"), false);
    } else {
        recipeTable.column(22).visible(false, false);
    }

    var chkChefs = $('#chk-recipe-show-chef').val();
    for (var j = 0; j < data.chefs.length; j++) {
        recipeTable.column(23 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
        recipeTable.column(24 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
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
    chefTable.column(9).visible($('#chk-chef-show-special-skill').prop("checked"), false);
    var chkHarvest = $('#chk-chef-show-harvest').prop("checked");
    chefTable.column(10).visible(chkHarvest, false);
    chefTable.column(11).visible(chkHarvest, false);
    chefTable.column(12).visible(chkHarvest, false);
    chefTable.column(13).visible(chkHarvest, false);
    chefTable.column(14).visible($('#chk-chef-show-sex').prop("checked"), false);
    chefTable.column(15).visible($('#chk-chef-show-origin').prop("checked"), false);

    var chkRecipes = $('#chk-chef-show-recipe').val();
    for (var j = 0; j < data.recipes.length; j++) {
        chefTable.column(16 + j).visible(chkRecipes.indexOf(j.toString()) > -1, false);
    }

    chefTable.columns.adjust().draw(false);
}

function initKitchenwareShow(kitchenwareTable) {
    kitchenwareTable.column(0).visible($('#chk-kitchenware-show-id').prop("checked"), false);
    kitchenwareTable.column(2).visible($('#chk-kitchenware-show-rarity').prop("checked"), false);
    kitchenwareTable.column(3).visible($('#chk-kitchenware-show-special-skill').prop("checked"), false);
    kitchenwareTable.column(4).visible($('#chk-kitchenware-show-origin').prop("checked"), false);

    kitchenwareTable.columns.adjust().draw(false);
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

    calRecipesTable.column(10).visible($('#chk-cal-recipes-show-ingredient').prop("checked"), false);
    calRecipesTable.column(11).visible($('#chk-cal-recipes-show-price').prop("checked"), false);
    calRecipesTable.column(12).visible($('#chk-cal-recipes-show-limit').prop("checked"), false);
    calRecipesTable.column(13).visible($('#chk-cal-recipes-show-total-price').prop("checked"), false);
    calRecipesTable.column(14).visible($('#chk-cal-recipes-show-origin').prop("checked"), false);

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

    calChefsTable.column(10).visible($('#chk-cal-chefs-show-special-skill').prop("checked"), false);
    calChefsTable.column(11).visible($('#chk-cal-chefs-show-sex').prop("checked"), false);
    calChefsTable.column(12).visible($('#chk-cal-chefs-show-origin').prop("checked"), false);

    calChefsTable.columns.adjust().draw(false);
}

function initCalIngredientsShow(calIngredientsTable) {
    calIngredientsTable.column(1).visible($('#chk-cal-ingredients-show-id').prop("checked"), false);
    calIngredientsTable.column(3).visible($('#chk-cal-ingredients-show-rarity').prop("checked"), false);
    calIngredientsTable.column(4).visible($('#chk-cal-ingredients-show-origin').prop("checked"), false);

    calIngredientsTable.columns.adjust().draw(false);
}

function initCalResultsShow(mode, calResultsTable, panel) {

    if (mode == "recipes") {

        panel.find('.chk-cal-results-show-chef-rarity').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-sex').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-skill').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-recipe-quality').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-kitchenware').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-chef-kitchenware-addition').prop("checked", false).closest(".btn").addClass("hidden");
        panel.find('.chk-cal-results-show-recipe-real-total-price').prop("checked", false).closest(".btn").addClass("hidden");

        calResultsTable.column(1).visible(false, false);    // chef name
        calResultsTable.column(22).visible(false, false);   // quality addtion
        calResultsTable.column(23).visible(false, false);   // skill addtion

    }

    calResultsTable.column(2).visible(panel.find('.chk-cal-results-show-chef-rarity').prop("checked"), false);
    calResultsTable.column(3).visible(panel.find('.chk-cal-results-show-chef-sex').prop("checked"), false);

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

    calResultsTable.column(18).visible(panel.find('.chk-cal-results-show-recipe-ingredient').prop("checked"), false);
    calResultsTable.column(21).visible(panel.find('.chk-cal-results-show-recipe-quality').prop("checked"), false);
    calResultsTable.column(24).visible(panel.find('.chk-cal-results-show-chef-kitchenware').prop("checked"), false);
    calResultsTable.column(25).visible(panel.find('.chk-cal-results-show-chef-kitchenware-addition').prop("checked"), false);
    calResultsTable.column(26).visible(panel.find('.chk-cal-results-show-bonus-addition').prop("checked"), false);
    calResultsTable.column(27).visible(panel.find('.chk-cal-results-show-recipe-total-price').prop("checked"), false);
    calResultsTable.column(28).visible(panel.find('.chk-cal-results-show-recipe-real-total-price').prop("checked"), false);
    calResultsTable.column(29).visible(panel.find('.chk-cal-results-show-bonus-score').prop("checked"), false);

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
            var newValue = inputField.val();
            cell.data(newValue);
            if (settings.onUpdate) {
                settings.onUpdate(table, row, cell);
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
            input.html = "<select data-live-search='true' data-width='fit' data-dropdown-align-right='auto' data-live-search-placeholder='查找' data-none-results-text='没有找到'>";
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
