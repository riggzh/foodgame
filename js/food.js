var calWorker, calRecipesTable, calChefsTable, calIngredientsTable, calResultsTable;

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
                "_": "fire",
                "display": "fireDisp"
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
            "data": "total"
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

    for (j in data.chefs) {
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

        var chkFire0 = $('#chk-recipe-fire-0').prop("checked");
        var chkFire1 = $('#chk-recipe-fire-1').prop("checked");
        var chkFire2 = $('#chk-recipe-fire-2').prop("checked");
        var chkFire3 = $('#chk-recipe-fire-3').prop("checked");
        var chkFire4 = $('#chk-recipe-fire-4').prop("checked");
        var chkFire5 = $('#chk-recipe-fire-5').prop("checked");
        var fire = Math.floor(data[2]) || 0;

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

        if ($('#chk-recipe-skill-stirfry').prop("checked") && (Math.floor(data[3]) || 0) > 0
            || $('#chk-recipe-skill-boil').prop("checked") && (Math.floor(data[4]) || 0) > 0
            || $('#chk-recipe-skill-cut').prop("checked") && (Math.floor(data[5]) || 0) > 0
            || $('#chk-recipe-skill-fry').prop("checked") && (Math.floor(data[6]) || 0) > 0
            || $('#chk-recipe-skill-roast').prop("checked") && (Math.floor(data[7]) || 0) > 0
            || $('#chk-recipe-skill-steam').prop("checked") && (Math.floor(data[8]) || 0) > 0
            || ($('#chk-recipe-skill-unknown').prop("checked") && (Math.floor(data[3]) || 0) == 0 && (Math.floor(data[4]) || 0) == 0 && (Math.floor(data[5]) || 0) == 0
                && (Math.floor(data[6]) || 0) == 0 && (Math.floor(data[7]) || 0) == 0 && (Math.floor(data[8]) || 0) == 0)
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
        $('#chk-recipe-show-origin').prop("checked", false)
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
                "_": "fire",
                "display": "fireDisp"
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

    for (j in data.recipes) {
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

        var chkFire1 = $('#chk-chef-fire-1').prop("checked");
        var chkFire2 = $('#chk-chef-fire-2').prop("checked");
        var chkFire3 = $('#chk-chef-fire-3').prop("checked");
        var chkFire4 = $('#chk-chef-fire-4').prop("checked");
        var chkFire5 = $('#chk-chef-fire-5').prop("checked");
        var fire = Math.floor(data[2]) || 0;

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
        var searchCols = [1, 9, 15];

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
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
            initChefShow(chefTable, data);
        }
    });

    $('.chk-chef-show-recipe-wrapper .deselect-all').click(function () {
        $('#chk-chef-show-recipe').multiselect('deselectAll', false);
        $('#chk-chef-show-recipe').multiselect('updateButtonText');
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

    $('#pane-chefs .search-box input').keyup(function () {
        chefTable.draw();
    });

    initChefShow(chefTable, data);
}

function initCalTables(json, data) {
    initCalRecipesTable(data);
    initCalChefsTable(data);
    initCalIngredientsTable(data)
    initCalResultsTable();

    $.fn.dataTable.ext.order['dom-selected'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $(td).parent("tr").hasClass("selected") ? '1' : '0';
        });
    }

    $.fn.dataTable.ext.order['dom-text-numeric'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $('input', td).val() * 1;
        });
    }
}

function initCalRecipesTable(data) {
    var recipesData = generateCalRecipeData(data);
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
                "_": "fire",
                "display": "fireDisp"
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
            "data": "total"
        },
        {
            "data": "totalPrice"
        },
        {
            "data": "origin"
        },
        {
            "data": undefined,
            "defaultContent": "",
            "className": "cal-td-input",
            "orderDataType": "dom-text-numeric",
            "width": "38px",
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).html("<input type='text' class='form-control input-addition'>");
            }
        }
    ];

    calRecipesTable = $('#cal-recipes-table').DataTable({
        data: recipesData,
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
            selector: 'td:not(.cal-td-input)'
        },
        autoWidth: false,
        createdRow: function (row, data, index) {
            $(row).addClass('fire-' + data.fire);
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

    $('.chk-cal-recipes-show').click(function () {
        initCalRecipesShow(calRecipesTable);
    });

    $('.chk-cal-recipes-fire').click(function () {
        if ($('#chk-cal-recipes-fire-1').prop("checked")) {
            calRecipesTable.rows('.fire-1').select();
        } else {
            calRecipesTable.rows('.fire-1').deselect();
        }

        if ($('#chk-cal-recipes-fire-2').prop("checked")) {
            calRecipesTable.rows('.fire-2').select();
        } else {
            calRecipesTable.rows('.fire-2').deselect();
        }

        if ($('#chk-cal-recipes-fire-3').prop("checked")) {
            calRecipesTable.rows('.fire-3').select();
        } else {
            calRecipesTable.rows('.fire-3').deselect();
        }

        if ($('#chk-cal-recipes-fire-4').prop("checked")) {
            calRecipesTable.rows('.fire-4').select();
        } else {
            calRecipesTable.rows('.fire-4').deselect();
        }

        if ($('#chk-cal-recipes-fire-5').prop("checked")) {
            calRecipesTable.rows('.fire-5').select();
        } else {
            calRecipesTable.rows('.fire-5').deselect();
        }
    });

    $('#chk-cal-recipes-addition').change(function () {
        initCalRecipesShow(calRecipesTable);
        if ($(this).prop("checked")) {
            $("#chk-cal-recipes-addition-wrapper").removeClass("hidden");
        } else {
            $("#chk-cal-recipes-addition-wrapper").addClass("hidden");
        }
    });

    $("#btn-cal-recipes-addition-clear").click(function () {
        calRecipesTable.rows().nodes().to$().find(".input-addition").val("");
    });

    $("#btn-cal-recipes-addition-add").click(function () {
        var category = $("#select-cal-recipes-category").val();
        var addition = Math.floor($("#input-cal-recipes-addition").val());
        if (category && addition) {
            calRecipesTable.rows({ selected: true }).every(function (rowIdx, tableLoop, rowLoop) {
                var recipeCategories = this.data().categories;
                for (var i in recipeCategories) {
                    if (recipeCategories[i] == category) {
                        var oldValue = Math.floor($(this.node()).find('.input-addition').val());
                        $(this.node()).find('.input-addition').val(oldValue + addition);
                    }
                }
            });
        }
    });

    $('#pane-cal-recipes .search-box input').keyup(function () {
        calRecipesTable.draw();
    });

    $('#btn-cal-recipes-select-all').click(function () {
        calRecipesTable.rows().select();
    });

    $('#btn-cal-recipes-deselect-all').click(function () {
        calRecipesTable.rows().deselect();
    });

    calRecipesTable.rows().select();

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
                "_": "fire",
                "display": "fireDisp"
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
            "data": undefined,
            "defaultContent": "",
            "className": "cal-td-input",
            "orderDataType": "dom-text-numeric",
            "width": "38px",
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).html("<input type='text' class='form-control input-addition'>");
            }
        }
    ];

    calChefsTable = $('#cal-chefs-table').DataTable({
        data: data.chefs,
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
            selector: 'td:not(.cal-td-input)'
        },
        autoWidth: false,
        createdRow: function (row, data, index) {
            $(row).addClass('fire-' + data.fire);
            $(row).addClass(data.sex == "男" ? "sex-1" : "sex-0");
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

    $('.chk-cal-chefs-show').click(function () {
        initCalChefsShow(calChefsTable);
    });

    $('.chk-cal-chefs-fire input[type="checkbox"], .chk-cal-chefs-sex input[type="checkbox"]').click(function () {
        var chkFire1 = $('#chk-cal-chefs-fire-1').prop("checked");
        var chkFire2 = $('#chk-cal-chefs-fire-2').prop("checked");
        var chkFire3 = $('#chk-cal-chefs-fire-3').prop("checked");
        var chkFire4 = $('#chk-cal-chefs-fire-4').prop("checked");
        var chkFire5 = $('#chk-cal-chefs-fire-5').prop("checked");

        var chkMale = $('#chk-cal-chefs-sex-male').prop("checked");
        var chkFemale = $('#chk-cal-chefs-sex-female').prop("checked");

        if (chkFire1 && chkMale) {
            calChefsTable.rows('.sex-1.fire-1').select();
        } else {
            calChefsTable.rows('.sex-1.fire-1').deselect();
        }

        if (chkFire1 && chkFemale) {
            calChefsTable.rows('.sex-0.fire-1').select();
        } else {
            calChefsTable.rows('.sex-0.fire-1').deselect();
        }

        if (chkFire2 && chkMale) {
            calChefsTable.rows('.sex-1.fire-2').select();
        } else {
            calChefsTable.rows('.sex-1.fire-2').deselect();
        }

        if (chkFire2 && chkFemale) {
            calChefsTable.rows('.sex-0.fire-2').select();
        } else {
            calChefsTable.rows('.sex-0.fire-2').deselect();
        }

        if (chkFire3 && chkMale) {
            calChefsTable.rows('.sex-1.fire-3').select();
        } else {
            calChefsTable.rows('.sex-1.fire-3').deselect();
        }

        if (chkFire3 && chkFemale) {
            calChefsTable.rows('.sex-0.fire-3').select();
        } else {
            calChefsTable.rows('.sex-0.fire-3').deselect();
        }

        if (chkFire4 && chkMale) {
            calChefsTable.rows('.sex-1.fire-4').select();
        } else {
            calChefsTable.rows('.sex-1.fire-4').deselect();
        }

        if (chkFire4 && chkFemale) {
            calChefsTable.rows('.sex-0.fire-4').select();
        } else {
            calChefsTable.rows('.sex-0.fire-4').deselect();
        }

        if (chkFire5 && chkMale) {
            calChefsTable.rows('.sex-1.fire-5').select();
        } else {
            calChefsTable.rows('.sex-1.fire-5').deselect();
        }

        if (chkFire5 && chkFemale) {
            calChefsTable.rows('.sex-0.fire-5').select();
        } else {
            calChefsTable.rows('.sex-0.fire-5').deselect();
        }
    });

    $('#chk-cal-chefs-addition').change(function () {
        initCalChefsShow(calChefsTable);
        if ($(this).prop("checked")) {
            $("#chk-cal-chefs-addition-wrapper").removeClass("hidden");
        } else {
            $("#chk-cal-chefs-addition-wrapper").addClass("hidden");
        }
    });

    $("#btn-cal-chefs-addition-clear").click(function () {
        calChefsTable.rows().nodes().to$().find(".input-addition").val("");
    });

    $('#pane-cal-chefs .search-box input').keyup(function () {
        calChefsTable.draw();
    });

    $('#btn-cal-chefs-select-all').click(function () {
        calChefsTable.rows().select();
    });

    $('#btn-cal-chefs-deselect-all').click(function () {
        calChefsTable.rows().deselect();
    });

    calChefsTable.rows().select();

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
                "_": "fire",
                "display": "fireDisp"
            }
        },
        {
            "data": "origin"
        },
        {
            "data": undefined,
            "defaultContent": "",
            "className": "cal-td-input",
            "orderDataType": "dom-text-numeric",
            "width": "38px",
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).html("<input type='text' class='form-control input-addition'>");
            }
        }
    ];

    calIngredientsTable = $('#cal-ingredients-table').DataTable({
        data: data.ingredients,
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
            selector: 'td:not(.cal-td-input)'
        },
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

    $('.chk-cal-ingredients-show').click(function () {
        initCalIngredientsShow(calIngredientsTable);
    });

    $('.chk-cal-ingredients-origin input[type="checkbox"]').click(function () {
        if ($('#chk-cal-ingredients-origin-greenhouse').prop("checked")) {
            calIngredientsTable.rows('.origin-1').select();
        } else {
            calIngredientsTable.rows('.origin-1').deselect();
        }

        if ($('#chk-cal-ingredients-origin-garden').prop("checked")) {
            calIngredientsTable.rows('.origin-2').select();
        } else {
            calIngredientsTable.rows('.origin-2').deselect();
        }

        if ($('#chk-cal-ingredients-origin-forest').prop("checked")) {
            calIngredientsTable.rows('.origin-3').select();
        } else {
            calIngredientsTable.rows('.origin-3').deselect();
        }

        if ($('#chk-cal-ingredients-origin-chicken').prop("checked")) {
            calIngredientsTable.rows('.origin-4').select();
        } else {
            calIngredientsTable.rows('.origin-4').deselect();
        }

        if ($('#chk-cal-ingredients-origin-pork').prop("checked")) {
            calIngredientsTable.rows('.origin-5').select();
        } else {
            calIngredientsTable.rows('.origin-5').deselect();
        }

        if ($('#chk-cal-ingredients-origin-beef').prop("checked")) {
            calIngredientsTable.rows('.origin-6').select();
        } else {
            calIngredientsTable.rows('.origin-6').deselect();
        }

        if ($('#chk-cal-ingredients-origin-wheat').prop("checked")) {
            calIngredientsTable.rows('.origin-7').select();
        } else {
            calIngredientsTable.rows('.origin-7').deselect();
        }

        if ($('#chk-cal-ingredients-origin-fish').prop("checked")) {
            calIngredientsTable.rows('.origin-8').select();
        } else {
            calIngredientsTable.rows('.origin-8').deselect();
        }
    });

    $('#chk-cal-ingredients-addition').change(function () {
        initCalIngredientsShow(calIngredientsTable);
        if ($(this).prop("checked")) {
            $("#chk-cal-ingredients-addition-wrapper").removeClass("hidden");
        } else {
            $("#chk-cal-ingredients-addition-wrapper").addClass("hidden");
        }
    });

    $("#btn-cal-ingredients-addition-clear").click(function () {
        calIngredientsTable.rows().nodes().to$().find(".input-addition").val("");
    });

    $('#pane-cal-ingredients .search-box input').keyup(function () {
        calIngredientsTable.draw();
    });

    $('#btn-cal-ingredients-select-all').click(function () {
        calIngredientsTable.rows().select();
    });

    $('#btn-cal-ingredients-deselect-all').click(function () {
        calIngredientsTable.rows().deselect();
    });

    calIngredientsTable.rows().select();

    initCalIngredientsShow(calIngredientsTable);
}

function initCalResultsTable() {
    var calResultsColumns = [
        {
            "data": undefined,
            "defaultContent": "",
            "className": 'select-checkbox',
            "orderDataType": "dom-selected",
            "width": "30px"
        },
        {
            "data": "chef.name"
        },
        {
            "data": {
                "_": "chef.fire",
                "display": "chef.fireDisp"
            }
        },
        {
            "data": "chef.sex"
        },
        {
            "data": "chef.stirfry"
        },
        {
            "data": "chef.boil"
        },
        {
            "data": "chef.cut"
        },
        {
            "data": "chef.fry"
        },
        {
            "data": "chef.roast"
        },
        {
            "data": "chef.steam"
        },
        {
            "data": "recipe.data.name"
        },
        {
            "data": {
                "_": "recipe.data.fire",
                "display": "recipe.data.fireDisp"
            }
        },
        {
            "data": "recipe.data.stirfry"
        },
        {
            "data": "recipe.data.boil"
        },
        {
            "data": "recipe.data.cut"
        },
        {
            "data": "recipe.data.fry"
        },
        {
            "data": "recipe.data.roast"
        },
        {
            "data": "recipe.data.steam"
        },
        {
            "data": {
                "_": "recipe.data.ingredientsVal",
                "display": "recipe.data.ingredientsDisp"
            }
        },
        {
            "data": "recipe.data.price"
        },
        {
            "data": "recipe.quantity"
        },
        {
            "data": {
                "_": "recipe.qualityVal",
                "display": "recipe.qualityDisp"
            }
        },
        {
            "data": {
                "_": "recipe.qualityAddition",
                "display": "recipe.qualityAdditionDisp"
            }
        },
        {
            "data": {
                "_": "recipe.skillAddition",
                "display": "recipe.skillAdditionDisp"
            }
        },
        {
            "data": {
                "_": "recipe.otherAddition",
                "display": "recipe.otherAdditionDisp"
            }
        },
        {
            "data": "recipe.totalPrice"
        },
        {
            "data": "recipe.realTotalPrice"
        },
        {
            "data": "recipe.bonusScore"
        },
        {
            "data": "recipe.totalScore"
        }
    ];

    var calResultsFilterFunction1 = function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-results-table')) {
            return true;
        }

        var value = $("#pane-cal-results .search-box input").val();
        var searchCols = [1, 10, 18];   //chefname, recipename, ingredients

        for (var i = 0, len = searchCols.length; i < len; i++) {
            if (data[searchCols[i]].indexOf(value) !== -1) {
                return true;
            }
        }

        return false;
    }

    var calResultsFilterFunction2 = function (settings, data, dataIndex) {
        if (settings.nTable != document.getElementById('cal-results-table')) {
            return true;
        }

        if ($('#chk-cal-results-show-selected').prop("checked")) {
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
    }

    $('.btn-cal-results-cal').click(function () {

        var mode = "";
        if (this.id == "btn-cal-results-cal-all") {
            mode = "all";
        } else if (this.id == "btn-cal-results-cal-optimal") {
            mode = "optimal";
        } else if (this.id == "btn-cal-results-cal-stop") {
            mode = "stop";
        }

        if (mode != "stop") {
            $(".btn-cal-results-cal").prop("disabled", true);
            $("#btn-cal-results-cal-stop").prop("disabled", false);
            $(".cal-results-wrapper").addClass("hidden");
            $(".cal-results-progress .progress-bar").css("width", "0%");
            $(".cal-results-progress .progress-bar span").text("预处理中");
            $(".cal-results-progress").removeClass("hidden");
        }

        if (typeof (calWorker) != "undefined") {
            calWorker.terminate();
            calWorker = undefined;
        }

        if (mode != "stop") {
            calWorker = new Worker("js/cal.min.js");

            calWorker.onmessage = function (event) {
                if (event.data.progress) {
                    $(".cal-results-progress .progress-bar").css("width", event.data.progress.value + "%");
                    $(".cal-results-progress .progress-bar span").text(event.data.progress.display);
                } else if (event.data.menu) {

                    $("#btn-cal-results-cal-stop").prop("disabled", true);

                    setTimeout(function () {
                        $(".cal-results-progress .progress-bar span").text("加载中");
                    }, 500);

                    setTimeout(function () {

                        if (calResultsTable) {
                            $.fn.dataTableExt.afnFiltering.splice($.fn.dataTableExt.afnFiltering.indexOf(calResultsFilterFunction1), 1);
                            $.fn.dataTableExt.afnFiltering.splice($.fn.dataTableExt.afnFiltering.indexOf(calResultsFilterFunction2), 1);
                            calResultsTable.destroy();
                        }
                        calResultsTable = $('#cal-results-table').DataTable({
                            data: event.data.menu,
                            columns: calResultsColumns,
                            language: {
                                search: "查找:",
                                lengthMenu: "一页显示 _MENU_ 个",
                                zeroRecords: "没有找到",
                                info: "共 _MAX_ 个",
                                infoEmpty: "没有数据",
                                infoFiltered: "",
                                select: {
                                    rows: {
                                        _: "选择了 %d 个",
                                        0: "选择了 %d 个",
                                        1: "选择了 %d 个"
                                    }
                                }
                            },
                            pagingType: "numbers",
                            lengthMenu: [[10, 20, 50, 100, -1], [10, 20, 50, 100, "所有"]],
                            pageLength: 20,
                            dom: "<'row'<'col-sm-12'<'selected-sum'>>>" +
                                "<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'search-box'>>>" +
                                "<'row'<'col-sm-12'tr>>" +
                                "<'row'<'col-sm-12'p>>",
                            select: {
                                style: 'multi'
                            },
                            autoWidth: false,
                            order: [[28, "desc"]]  //score
                        });

                        $("#pane-cal-results div.search-box").html('<label>查找:<input type="search" class="form-control input-sm" placeholder="厨师 菜名 材料"></label>');
                        $("#pane-cal-results .selected-sum").html("点击列可选择");

                        $.fn.dataTableExt.afnFiltering.push(calResultsFilterFunction1);
                        $.fn.dataTableExt.afnFiltering.push(calResultsFilterFunction2);

                        calResultsTable.on('select deselect', function (e, dt, type, indexes) {
                            var selectedRows = dt.rows({ selected: true }).indexes();
                            var totalPrice = dt.cells(selectedRows, 25).data().reduce(function (a, b) { return a + b; }, 0);    //totalPrice
                            var realTotalPrice = dt.cells(selectedRows, 26).data().reduce(function (a, b) { return a + b; }, 0);    //realTotalPrice
                            var bonusScore = dt.cells(selectedRows, 27).data().reduce(function (a, b) { return a + b; }, 0);    //bonusScore
                            var totalScore = dt.cells(selectedRows, 28).data().reduce(function (a, b) { return a + b; }, 0);    //totalScore
                            $("#pane-cal-results .selected-sum").html("原售价：" + totalPrice + " 实售价：" + realTotalPrice + " 规则分：" + bonusScore + " 总得分：" + totalScore);

                            if ($('#chk-cal-results-show-selected').prop("checked")) {
                                calResultsTable.draw();
                            }
                        })

                        $('#pane-cal-results .search-box input').keyup(function () {
                            calResultsTable.draw();
                        });

                        var allResultsSearchInput = "";
                        var selectedResultsSearchInput = "";
                        $('#chk-cal-results-show-selected').change(function () {
                            if ($('#chk-cal-results-show-selected').prop("checked")) {
                                selectedResultsSearchInput = $('#pane-cal-results .search-box input').val();
                                $('#pane-cal-results .search-box input').val(allResultsSearchInput);
                            } else {
                                allResultsSearchInput = $('#pane-cal-results .search-box input').val();
                                $('#pane-cal-results .search-box input').val(selectedResultsSearchInput);
                            }
                            calResultsTable.draw();
                        });

                        $('.chk-cal-results-show').off('click').click(function () {
                            initCalResultsShow(calResultsTable);
                        });

                        $('#chk-cal-results-show-all').off('click').click(function () {
                            if ($('.chk-cal-results-show:checked').length == $('.chk-cal-results-show').length) {
                                $('.chk-cal-results-show').prop("checked", false);
                            }
                            else {
                                $('.chk-cal-results-show').prop("checked", true);
                            }
                            initCalResultsShow(calResultsTable);
                        });

                        initCalResultsShow(calResultsTable);

                        if (mode == "optimal") {
                            $(".chk-cal-results-show-selected-wrapper").addClass("hidden");
                            calResultsTable.rows().select();
                        } else if (mode == "all") {
                            $(".chk-cal-results-show-selected-wrapper").removeClass("hidden");
                        }

                        $(".cal-results-progress").addClass("hidden");
                        $(".cal-results-wrapper").removeClass("hidden");
                        $(".btn-cal-results-cal").prop("disabled", false);
                        $("#btn-cal-results-cal-stop").prop("disabled", true);
                    }, 1000);
                }
            };

            var calRecipesData = new Array();
            var hasRecipesAddition = $("#chk-cal-recipes-addition").prop("checked");
            calRecipesTable.rows({ selected: true }).every(function (rowIdx, tableLoop, rowLoop) {
                var rowData = this.data();
                if (hasRecipesAddition) {
                    rowData["addition"] = $(this.node()).find('.input-addition').val();
                } else {
                    rowData["addition"] = "";
                }
                calRecipesData.push(rowData);
            });

            var calChefsData = new Array();
            var hasChefsAddition = $("#chk-cal-chefs-addition").prop("checked");
            calChefsTable.rows({ selected: true }).every(function (rowIdx, tableLoop, rowLoop) {
                var rowData = this.data();
                if (hasChefsAddition) {
                    rowData["addition"] = $(this.node()).find('.input-addition').val();
                } else {
                    rowData["addition"] = "";
                }
                calChefsData.push(rowData);
            });

            var calIngredientsData = new Array();
            var hasIngredientsAddition = $("#chk-cal-ingredients-addition").prop("checked");
            calIngredientsTable.rows({ selected: true }).every(function (rowIdx, tableLoop, rowLoop) {
                var rowData = this.data();
                if (hasIngredientsAddition) {
                    rowData["addition"] = $(this.node()).find('.input-addition').val();
                } else {
                    rowData["addition"] = "";
                }
                calIngredientsData.push(rowData);
            });

            var ingredientsAdditionCumulative = $("#chk-cal-ingredients-addition-cumulative").prop("checked");

            var limit = $("#input-cal-results-show-top").val();
            var recipesMulitple = $("#chk-cal-recipes-mulitple").prop("checked");


            calWorker.postMessage({
                "recipes": calRecipesData,
                "chefs": calChefsData,
                "ingredients": calIngredientsData,
                'mode': mode,
                "limit": limit,
                "recipesMulitple": recipesMulitple,
                "hasRecipesAddition": hasRecipesAddition,
                "hasChefsAddition": hasChefsAddition,
                "hasIngredientsAddition": hasIngredientsAddition,
                "ingredientsAdditionCumulative": ingredientsAdditionCumulative
            });
        } else {
            $(".cal-results-progress").addClass("hidden");
            $(".btn-cal-results-cal").prop("disabled", false);
            $("#btn-cal-results-cal-stop").prop("disabled", true);
        }
    });

}

function generateData(json, private) {
    var retData = new Object();

    retData["history"] = json.history;

    var ingredientsData = new Array();
    for (i in json.ingredients) {
        var ingredientData = new Object();
        ingredientData = json.ingredients[i];
        ingredientData["fireDisp"] = getFireDisp(json.ingredients[i].fire);
        ingredientData["originVal"] = getOriginVal(json.ingredients[i].origin);
        ingredientsData.push(ingredientData);
    }
    retData["ingredients"] = ingredientsData;

    var chefsData = new Array();
    for (i in json.chefs) {

        if (!json.chefs[i].name) {
            continue;
        }

        var chefData = new Object();
        chefData = json.chefs[i];
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

        chefData["chefIdDisp"] = json.chefs[i].chefId + " - " + (json.chefs[i].chefId + 2),
            chefData["fireDisp"] = getFireDisp(json.chefs[i].fire);

        var specialSkillDisp = "";
        var specialSkillVal = "";
        for (j in json.chefs[i].skill) {
            specialSkillDisp += json.chefs[i].skill[j].type + " ";
            if (json.chefs[i].skill[j].addition) {
                specialSkillDisp += json.chefs[i].skill[j].addition * 100 + "% ";
            }
            specialSkillVal = json.chefs[i].skill[j].type;
        }

        chefData["specialSkillVal"] = specialSkillVal;
        chefData["specialSkillDisp"] = specialSkillDisp;

        chefsData.push(chefData);
    }
    retData["chefs"] = chefsData;

    var recipesData = new Array();
    for (i in json.recipes) {

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
        recipeData["total"] = json.recipes[i].total || "";

        recipeData["timeDisp"] = secondsToTime(json.recipes[i].time);
        recipeData["fireDisp"] = getFireDisp(json.recipes[i].fire);

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
        for (m in json.guests) {
            for (n in json.guests[m].gifts) {
                if (json.recipes[i].name == json.guests[m].gifts[n].recipe) {
                    guests += json.guests[m].name + "-" + json.guests[m].gifts[n].rune + "<br>";
                    break;
                }
            }
        }
        recipeData["guestsDisp"] = guests;

        recipeData["chefs"] = new Array();
        for (j in retData["chefs"]) {

            var qualityInfo = getQualityInfo(json.recipes[i], retData["chefs"][j]);

            var chefEff = 0;

            if (qualityInfo.qualityVal > 0) {

                var skillAddition = getChefSkillAddition(json.recipes[i], retData["chefs"][j], retData["ingredients"]);

                if (efficiency > 0) {
                    chefEff = (1 + qualityInfo.qualityAddition + skillAddition + (private ? json.furniture : 0)) * efficiency;
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

function generateCalRecipeData(data) {
    var calRecipesData = new Array();
    for (i in data.recipes) {

        if (!data.recipes[i].price) {
            continue;
        }

        calRecipesData.push(data.recipes[i]);
    }
    return calRecipesData;
}

function getQualityInfo(recipe, chef) {
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

function getChefSkillAddition(recipe, chef, ingredients) {
    var skillAddition = 0;

    if (chef.hasOwnProperty('skill')) {
        for (var k in chef.skill) {
            var hasSkill = false;
            if (chef.skill[k].type.indexOf("水产") >= 0) {
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
            }
            if (chef.skill[k].type.indexOf("面") >= 0) {
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
            }
            if (chef.skill[k].type.indexOf("肉") >= 0) {
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
            }
            if (chef.skill[k].type.indexOf("蔬菜") >= 0) {
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

function getFireDisp(fire) {
    var fireDisp = "";
    for (var j = 0; j < fire; j++) {
        fireDisp += "&#x2605;";
    }
    return fireDisp;
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
    recipeTable.column(9).visible($('#chk-recipe-show-ingredients').prop("checked"), false);
    recipeTable.column(10).visible($('#chk-recipe-show-price').prop("checked"), false);
    recipeTable.column(11).visible($('#chk-recipe-show-time').prop("checked"), false);
    recipeTable.column(12).visible($('#chk-recipe-show-total').prop("checked"), false);
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
    for (j = 0; j < data.chefs.length; j++) {
        recipeTable.column(23 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
        recipeTable.column(24 + 2 * j).visible(chkChefs.indexOf(j.toString()) > -1, false);
    }

    recipeTable.columns.adjust().draw(false);
}

function initChefShow(chefTable, data) {
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

function initCalRecipesShow(calRecipesTable) {
    calRecipesTable.column(1).visible($('#chk-cal-recipes-show-id').prop("checked"), false);
    calRecipesTable.column(3).visible($('#chk-cal-recipes-show-fire').prop("checked"), false);

    var chkSkill = $('#chk-cal-recipes-show-skill').prop("checked");
    calRecipesTable.column(4).visible(chkSkill, false);
    calRecipesTable.column(5).visible(chkSkill, false);
    calRecipesTable.column(6).visible(chkSkill, false);
    calRecipesTable.column(7).visible(chkSkill, false);
    calRecipesTable.column(8).visible(chkSkill, false);
    calRecipesTable.column(9).visible(chkSkill, false);

    calRecipesTable.column(10).visible($('#chk-cal-recipes-show-ingredient').prop("checked"), false);
    calRecipesTable.column(11).visible($('#chk-cal-recipes-show-price').prop("checked"), false);
    calRecipesTable.column(12).visible($('#chk-cal-recipes-show-total').prop("checked"), false);
    calRecipesTable.column(13).visible($('#chk-cal-recipes-show-total-price').prop("checked"), false);
    calRecipesTable.column(14).visible($('#chk-cal-recipes-show-origin').prop("checked"), false);
    calRecipesTable.column(15).visible($('#chk-cal-recipes-addition').prop("checked"), false);

    calRecipesTable.columns.adjust().draw(false);
}

function initCalChefsShow(calChefsTable) {
    calChefsTable.column(1).visible($('#chk-cal-chefs-show-id').prop("checked"), false);
    calChefsTable.column(3).visible($('#chk-cal-chefs-show-fire').prop("checked"), false);

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
    calChefsTable.column(13).visible($('#chk-cal-chefs-addition').prop("checked"), false);

    calChefsTable.columns.adjust().draw(false);
}

function initCalIngredientsShow(calIngredientsTable) {
    calIngredientsTable.column(1).visible($('#chk-cal-ingredients-show-id').prop("checked"), false);
    calIngredientsTable.column(3).visible($('#chk-cal-ingredients-show-fire').prop("checked"), false);
    calIngredientsTable.column(4).visible($('#chk-cal-ingredients-show-origin').prop("checked"), false);
    calIngredientsTable.column(5).visible($('#chk-cal-ingredients-addition').prop("checked"), false);

    calIngredientsTable.columns.adjust().draw(false);
}

function initCalResultsShow(calResultsTable) {

    calResultsTable.column(2).visible($('#chk-cal-results-show-chef-fire').prop("checked"), false);
    calResultsTable.column(3).visible($('#chk-cal-results-show-chef-sex').prop("checked"), false);

    var chkChefSkill = $('#chk-cal-results-show-chef-skill').prop("checked");
    calResultsTable.column(4).visible(chkChefSkill, false);
    calResultsTable.column(5).visible(chkChefSkill, false);
    calResultsTable.column(6).visible(chkChefSkill, false);
    calResultsTable.column(7).visible(chkChefSkill, false);
    calResultsTable.column(8).visible(chkChefSkill, false);
    calResultsTable.column(9).visible(chkChefSkill, false);

    calResultsTable.column(11).visible($('#chk-cal-results-show-recipe-fire').prop("checked"), false);

    var chkRecipeSkill = $('#chk-cal-results-show-recipe-skill').prop("checked");
    calResultsTable.column(12).visible(chkRecipeSkill, false);
    calResultsTable.column(13).visible(chkRecipeSkill, false);
    calResultsTable.column(14).visible(chkRecipeSkill, false);
    calResultsTable.column(15).visible(chkRecipeSkill, false);
    calResultsTable.column(16).visible(chkRecipeSkill, false);
    calResultsTable.column(17).visible(chkRecipeSkill, false);

    calResultsTable.column(18).visible($('#chk-cal-results-show-recipe-ingredient').prop("checked"), false);
    calResultsTable.column(21).visible($('#chk-cal-results-show-recipe-quality').prop("checked"), false);
    calResultsTable.column(25).visible($('#chk-cal-results-show-recipe-total-price').prop("checked"), false);
    calResultsTable.column(26).visible($('#chk-cal-results-show-recipe-real-total-price').prop("checked"), false);
    calResultsTable.column(27).visible($('#chk-cal-results-show-recipe-bonus-score').prop("checked"), false);

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
        showNavigator: false,   //true
        showPrevious: false,    //true
        showNext: false         //true
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
