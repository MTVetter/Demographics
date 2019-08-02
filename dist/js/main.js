"use strict";

require(["esri/Map", "esri/WebMap", "esri/views/MapView", "esri/widgets/LayerList", "esri/layers/FeatureLayer", "esri/widgets/Home", "esri/widgets/BasemapToggle", "esri/widgets/Zoom", "esri/widgets/Legend", "esri/tasks/QueryTask", "esri/tasks/support/Query", "dgrid/OnDemandGrid", "dgrid/extensions/ColumnHider", "dojo/store/Memory", "dstore/legacy/StoreAdapter", "dgrid/Selection", "dojo/_base/declare", "dojo/number", "dojox/grid/EnhancedGrid", "dojox/grid/enhanced/plugins/exporter/CSVWriter", "esri/renderers/smartMapping/creators/color", "esri/widgets/Search", "esri/tasks/Locator", "esri/geometry/Extent"], function (Map, WebMap, MapView, LayerList, FeatureLayer, Home, BasemapToggle, Zoom, Legend, QueryTask, Query, OnDemandGrid, ColumnHider, Memory, StoreAdapter, Selection, declare, dojoNum, EnhancedGrid, CSVWriter, colorRendererCreator, Search, Locator, Extent) {
  //==========================
  //Variable list
  var bgValues = [];
  var ctValues = [];
  var countyValues = []; //==========================
  //Set up the renderers for the layers

  var ctRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [0, 0, 0, 0],
      outline: {
        color: [128, 0, 0, 0.7],
        width: 2
      }
    }
  };
  var countRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [255, 211, 127, 0.5],
      outline: {
        color: [110, 110, 110, 0.5],
        width: 1.5
      }
    }
  };
  var bgRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [0, 0, 0, 0],
      outline: {
        color: [0, 77, 168, 0.7],
        width: 1.5
      }
    }
  }; //==========================
  //Create the different popup templates

  var ctTemplate = {
    title: "{Tract}",
    content: [{
      type: "text",
      text: "<b>Total Population</b>: {Pop_Total}<br /><b>Total Number of Households</b>: {HH_Total}<br /><b>Total Number of Housing Units</b>: {HU_Total}<br /> <br /><b>White Population</b>: {Pop_White}<br /><b>Black Population</b>: {Pop_Black}<br /><b>Hispanic Population</b>: {Pop_Hispanic}<br /><b>Asian Population</b>: {Pop_Asian}<br /><b>Other Population</b>: {Pop_Other}<br /> <br /><b>People under age 5</b>: {Age_Under_5}<br /><b>People between age 5 and 17</b>: {Age_5to17}<br /><b>People between age 18 and 34</b>: {Age_18to34}<br /><b>People between age 35 and 64</b>: {Age_35to64}<br /><b>People Age 65 and Older</b>: {Age_65plus}<br /> <br /><b>Households with no car</b>: {Auto_0_Car}<br /><b>Households with 1 car</b>: {Auto_1_Car}<br /><b>Households with 2 cars</b>: {Auto_2_Car}<br /><b>Households with 3 cars</b>: {Auto_3_Car}<br /><b>Households with 4+ cars</b>: {Auto_4Plus_Car}<br /> <br /><b>People with no high school degree</b>: {Edu_No_High_School}<br /><b>People with high school degree</b>: {Edu_High_School}<br /><b>People with Associate/some degree</b>: {Edu_Associate}<br /><b>People with Bachelor's degree</b>: {Edu_Bachelors}<br /><b>People with graduate degree</b>: {Edu_Graduate}<br /> <br /><b>People who speak No English</b>: {Lang_No_Eng}<br /><b>People who speak English not well</b>: {Lang_Eng_Not_Well}<br /><b>People who speak English well</b>: {Lang_Eng_Well}<br /><b>People who speak English very well</b>: {Lang_Eng_Very_Well}<br /><b>People who speak English Only</b>: {Lang_Eng_Only}<br /> <br /><b>Households above poverty</b>: {Pov_Above}<br /><b>Households below poverty</b>: {Pov_Below}<br /><b>Household Income below 25k</b>: {Inc_Below_25}<br /><b>Household Income between 25k and 50k</b>: {Inc_25To50}<br /><b>Household Income between 50k and 100k</b>: {Inc_50To100}<br /><b>Household Income above 100k</b>: {Inc_Above_100}<br /><b>Median household income</b>: {Inc_HH_Median}<br /> <br /><b>Housing - owner occupied</b>: {H_Owner}<br /><b>Housing - renter occupied</b>:  {H_Renter}<br /> <br /><b>Means of travel to work - carpool</b>: {Mot_Carpool}<br /><b>Means of travel to work - drove alone</b>: {Mot_Drove_Alone}<br /><b>Means of travel to work - other</b>: {Mot_Other}<br /><b>Means of travel to work - ped/bike</b>: {Mot_Pedbike}<br /><b>Means of travel to work - telework</b>: {Mot_Telework}<br /><b>Means of travel to work - transit</b>: {Mot_Transit}<br /> <br /><b>Travel time to work - below 5 mins</b>: {Ttw_Below_5}<br /><b>Travel time to work - 5 to 15 mins</b>: {Ttw_5To15}<br /><b>Travel time to work - 15 to 30 mins</b>: {Ttw_15To30} <br /><b>Travel time to work - 30 to 60 mins</b>: {Ttw_30To60}<br /><b>Travel time to work - 60 mins and above</b>: {Ttw_60Plus}<br /> <br /><b>% of people with income below poverty level (past 12 months)</b>: {Pov_rate}<br /><b>Unemployment Rate</b>: {Unemp_Rate}<br /><b>Median House Value</b>: {Med_hu_val}<br /><b>Mean Travel Time to Work</b>: {Pop_Total}<br /> <br /><b>Total Population in 1980</b>: {tp_1980}<br /><b>Total Population in 1990</b>: {tp_1990}<br /><b>Total Population in 2000</b>: {tp_2000}<br /><b>Total Population in 2010</b>: {tp_2010}<br /><b><br />Census Tract Page</b>: <a href='{Tract_Website}' target='_blank'>Click for More Information</a>"
    }]
  };
  var bgTemplate = {
    title: "{Block_Group}",
    content: [{
      type: "text",
      text: "<b>Total Population</b>: {Pop_Total}<br /><b>Total Number of Households</b>: {HH_Total}<br /><b>Total Number of Housing Units</b>: {HU_Total}<br /> <br /><b>White Population</b>: {Pop_White}<br /><b>Black Population</b>: {Pop_Black}<br /><b>Hispanic Population</b>: {Pop_Hispanic}<br /><b>Asian Population</b>: {Pop_Asian}<br /><b>Other Population</b>: {Pop_Other}<br /> <br /><b>People under age 5</b>: {Age_Under_5}<br /><b>People between age 5 and 17</b>: {Age_5to17}<br /><b>People between age 18 and 34</b>: {Age_18to34}<br /><b>People between age 35 and 64</b>: {Age_35to64}<br /><b>People Age 65 and Older</b>: {Age_65plus}<br /> <br /><b>Households with no car</b>: {Auto_0_Car}<br /><b>Households with 1 car</b>: {Auto_1_Car}<br /><b>Households with 2 cars</b>: {Auto_2_Car}<br /><b>Households with 3 cars</b>: {Auto_3_Car}<br /><b>Households with 4+ cars</b>: {Auto_4Plus_Car}<br /> <br /><b>People with no high school degree</b>: {Edu_No_High_School}<br /><b>People with high school degree</b>: {Edu_High_School}<br /><b>People with Associate/some degree</b>: {Edu_Associate}<br /><b>People with Bachelor's degree</b>: {Edu_Bachelors}<br /><b>People with graduate degree</b>: {Edu_Graduate}<br /> <br /><b>People who speak No English</b>: {Lang_No_Eng}<br /><b>People who speak English not well</b>: {Lang_Eng_Not_Well}<br /><b>People who speak English well</b>: {Lang_Eng_Well}<br /><b>People who speak English very well</b>: {Lang_Eng_Very_Well}<br /><b>People who speak English Only</b>: {Lang_Eng_Only}<br /> <br /><b>Households above poverty</b>: {Pov_Above}<br /><b>Households below poverty</b>: {Pov_Below}<br /><b>Household Income below 25k</b>: {Inc_Below_25}<br /><b>Household Income between 25k and 50k</b>: {Inc_25To50}<br /><b>Household Income between 50k and 100k</b>: {Inc_50To100}<br /><b>Household Income above 100k</b>: {Inc_Above_100}<br /><b>Median household income</b>: {Inc_HH_Median}<br /> <br /><b>Housing - owner occupied</b>: {H_Owner}<br /><b>Housing - renter occupied</b>:  {H_Renter}<br /> <br /><b>Means of travel to work - carpool</b>: {Mot_Carpool}<br /><b>Means of travel to work - drove alone</b>: {Mot_Drove_Alone}<br /><b>Means of travel to work - other</b>: {Mot_Other}<br /><b>Means of travel to work - ped/bike</b>: {Mot_Pedbike}<br /><b>Means of travel to work - telework</b>: {Mot_Telework}<br /><b>Means of travel to work - transit</b>: {Mot_Transit}<br /> <br /><b>Travel time to work - below 5 mins</b>: {Ttw_Below_5}<br /><b>Travel time to work - 5 to 15 mins</b>: {Ttw_5To15}<br /><b>Travel time to work - 15 to 30 mins</b>: {Ttw_15To30} <br /><b>Travel time to work - 30 to 60 mins</b>: {Ttw_30To60}<br /><b>Travel time to work - 60 mins and above</b>: {Ttw_60Plus}<br /> <br /><b>% of people with income below poverty level (past 12 months)</b>: {Pov_rate}<br /><b>Unemployment Rate</b>: {Unemp_Rate}<br /><b>Median House Value</b>: {Med_hu_val}<br /><b>Mean Travel Time to Work</b>: {Pop_Total}<br /> <br /><b>Total Population in 1980</b>: {tp_1980}<br /><b>Total Population in 1990</b>: {tp_1990}<br /><b>Total Population in 2000</b>: {tp_2000}<br /><b>Total Population in 2010</b>: {tp_2010}"
    }]
  };
  var countyTemplate = {
    title: "{Name}",
    content: [{
      type: "text",
      text: "<b>Total Population</b>: {Pop_Total}<br /><b>Total Number of Households</b>: {HH_Total}<br /><b>Total Number of Housing Units</b>: {HU_Total}<br /> <br /><b>White Population</b>: {Pop_White}<br /><b>Black Population</b>: {Pop_Black}<br /><b>Hispanic Population</b>: {Pop_Hispanic}<br /><b>Asian Population</b>: {Pop_Asian}<br /><b>Other Population</b>: {Pop_Other}<br /> <br /><b>People under age 5</b>: {Age_Under_5}<br /><b>People between age 5 and 17</b>: {Age_5to17}<br /><b>People between age 18 and 34</b>: {Age_18to34}<br /><b>People between age 35 and 64</b>: {Age_35to64}<br /><b>People Age 65 and Older</b>: {Age_65plus}<br /> <br /><b>Households with no car</b>: {Auto_0_Car}<br /><b>Households with 1 car</b>: {Auto_1_Car}<br /><b>Households with 2 cars</b>: {Auto_2_Car}<br /><b>Households with 3 cars</b>: {Auto_3_Car}<br /><b>Households with 4+ cars</b>: {Auto_4Plus_Car}<br /> <br /><b>People with no high school degree</b>: {Edu_No_High_School}<br /><b>People with high school degree</b>: {Edu_High_School}<br /><b>People with Associate/some degree</b>: {Edu_Associate}<br /><b>People with Bachelor's degree</b>: {Edu_Bachelors}<br /><b>People with graduate degree</b>: {Edu_Graduate}<br /> <br /><b>People who speak No English</b>: {Lang_No_Eng}<br /><b>People who speak English not well</b>: {Lang_Eng_Not_Well}<br /><b>People who speak English well</b>: {Lang_Eng_Well}<br /><b>People who speak English very well</b>: {Lang_Eng_Very_Well}<br /><b>People who speak English Only</b>: {Lang_Eng_Only}<br /> <br /><b>Households above poverty</b>: {Pov_Above}<br /><b>Households below poverty</b>: {Pov_Below}<br /><b>Household Income below 25k</b>: {Inc_Below_25}<br /><b>Household Income between 25k and 50k</b>: {Inc_25To50}<br /><b>Household Income between 50k and 100k</b>: {Inc_50To100}<br /><b>Household Income above 100k</b>: {Inc_Above_100}<br /><b>Median household income</b>: {Inc_HH_Median}<br /> <br /><b>Housing - owner occupied</b>: {H_Owner}<br /><b>Housing - renter occupied</b>:  {H_Renter}<br /> <br /><b>Means of travel to work - carpool</b>: {Mot_Carpool}<br /><b>Means of travel to work - drove alone</b>: {Mot_Drove_Alone}<br /><b>Means of travel to work - other</b>: {Mot_Other}<br /><b>Means of travel to work - ped/bike</b>: {Mot_Pedbike}<br /><b>Means of travel to work - telework</b>: {Mot_Telework}<br /><b>Means of travel to work - transit</b>: {Mot_Transit}<br /> <br /><b>Travel time to work - below 5 mins</b>: {Ttw_Below_5}<br /><b>Travel time to work - 5 to 15 mins</b>: {Ttw_5To15}<br /><b>Travel time to work - 15 to 30 mins</b>: {Ttw_15To30} <br /><b>Travel time to work - 30 to 60 mins</b>: {Ttw_30To60}<br /><b>Travel time to work - 60 mins and above</b>: {Ttw_60Plus}<br /> <br /><b>% of people with income below poverty level (past 12 months)</b>: {Pov_rate}<br /><b>Unemployment Rate</b>: {Unemp_Rate}<br /><b>Median House Value</b>: {Med_hu_val}<br /><b>Mean Travel Time to Work</b>: {Pop_Total}<br /> <br /><b>Total Population in 1980</b>: {tp_1980}<br /><b>Total Population in 1990</b>: {tp_1990}<br /><b>Total Population in 2000</b>: {tp_2000}<br /><b>Total Population in 2010</b>: {tp_2010}<br /><b><br />County Page</b>: <a href='{County_Website}' target='_blank'>Click for More Information</a>"
    }]
  }; //==========================
  //Create the map and the map view

  var map = new Map({
    basemap: "streets-navigation-vector"
  });
  var view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-95.444, 29.756],
    zoom: 8
  });
  view.ui.remove("zoom");
  var censusBlocks = new FeatureLayer({
    url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Block_Groups/MapServer/0",
    outFields: ["*"],
    visible: false,
    title: "Block Groups",
    renderer: bgRenderer,
    popupTemplate: bgTemplate
  });
  var query = censusBlocks.createQuery();
  query.outFields = ["Block_Group"];
  censusBlocks.queryFeatures(query).then(bgFieldValues).then(addBGToValueSelect);
  var censusTracts = new FeatureLayer({
    url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Tracts/MapServer/0",
    outFields: ["*"],
    visible: false,
    title: "Census Tracts",
    renderer: ctRenderer,
    popupTemplate: ctTemplate
  });
  var ctQuery = censusTracts.createQuery();
  ctQuery.outFields = ["Tract"];
  censusTracts.queryFeatures(ctQuery).then(ctFieldValues).then(addCTtoValueSelect);
  var county = new FeatureLayer({
    url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Counties/MapServer/0",
    outFields: ["*"],
    title: "Counties",
    renderer: countRenderer,
    popupTemplate: countyTemplate
  }); //Add the layers to the map

  map.add(county);
  map.add(censusTracts);
  map.add(censusBlocks); //============================
  //Create the variables for the sidebar clicks

  var $links = $(".components li");
  var $arrows = $(".arrow-left");
  var $panelDivs = $(".panelDiv");
  var $content = $("#content"); //Function for sidebar links click

  $links.on("click", function (e) {
    var target = $(this).attr("panel-target");
    $("viewDiv").css("visibility", "visible");
    $("container").css("flex", "1");
    var isActive = $(this).hasClass("active");
    $links.removeClass("active");
    $arrows.hide();
    $panelDivs.hide();

    if (isActive) {
      $content.hide();
    } else {
      $content.show();
      var $allLinks = $("[panel-target=".concat(target, "]"));
      $allLinks.addClass("active");
      $allLinks.find(".arrow-left").show();
      $("div[panel-id=".concat(target, "]")).fadeIn(400);
    }
  }); //Close the content panel when clicked

  $("#content").on("click", ".closePanel", function () {
    $("#viewDiv").css("visibility", "visible");
    $("#container").css("flex", "1");
    $links.removeClass("active");
    $arrows.hide();
    $panelDivs.hide();
    $content.hide();
  }); //==================================
  //Create the widgets for the application

  var zoom = new Zoom({
    view: view
  });
  view.ui.add(zoom, "bottom-right");
  var home = new Home({
    view: view
  });
  view.ui.add(home, "bottom-right");
  var baseToggle = new BasemapToggle({
    view: view,
    nextBasemap: "hybrid"
  });
  view.ui.add(baseToggle, "bottom-right");
  var layerList = new LayerList({
    view: view,
    container: document.getElementById("layerList")
  });
  var legend = new Legend({
    view: view,
    container: document.getElementById("legendList")
  });
  var searchWidget = new Search({
    view: view,
    includeDefaultSources: false,
    sources: [{
      locator: new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
      }),
      singleLineFieldName: "SingleLine",
      outFields: ["Addr_type"],
      searchExtent: new Extent({
        xmax: -97.292800,
        ymax: 30.797600,
        xmin: -93.236100,
        ymin: 28.460500
      }),
      placeholder: "3555 Timmons Ln, Houston, TX"
    }]
  });
  view.ui.add(searchWidget, "bottom-right"); //=====================================
  //Functions to populate the dropdown list

  var valueSelect = document.getElementById("bgValueType");
  var bgReportValues = document.getElementById("bgAttSelect");
  var ctValueSelect = document.getElementById("ctValueType");
  var ctReportValues = document.getElementById("ctAttSelect"); // var countValueType = document.getElementById("countValueType");

  function bgFieldValues(response) {
    var features = response.features;
    var values = features.map(function (feature) {
      return feature.attributes.Block_Group;
    });
    return values;
  }

  function addBGToValueSelect(values) {
    values.forEach(function (item, i) {
      if ((bgValues.length < 1 || bgValues.indexOf(item) === -1) && item !== "") {
        bgValues.push(item);
      }
    });
    bgValues.sort();
    bgValues.forEach(function (value) {
      var option = document.createElement("option");
      var option2 = document.createElement("option");
      option.text = value;
      option2.text = value;
      valueSelect.add(option);
      bgReportValues.add(option2);
    });
  }

  function ctFieldValues(response) {
    var features = response.features;
    var values = features.map(function (feature) {
      return feature.attributes.Tract;
    });
    return values;
  }

  function addCTtoValueSelect(values) {
    values.forEach(function (item, i) {
      if ((ctValues.length < 1 || ctValues.indexOf(item) === -1) && item !== "") {
        ctValues.push(item);
      }
    });
    ctValues.sort();
    ctValues.forEach(function (value) {
      var ctOption = document.createElement("option");
      var ctOption2 = document.createElement("option");
      ctOption.text = value;
      ctOption2.text = value;
      ctValueSelect.add(ctOption);
      ctReportValues.add(ctOption2);
    });
  } //===================================
  //Check to see which dropdown has been selected


  $("#boundaryType").change(function () {
    var selValue = $("#boundaryType").val();

    if (selValue == "BlockGroups") {
      $("#bgValueType").show();
      $("#bgValueType").css("visibility", "visible");
      $("#ctValueType").hide();
      $("#ctValueType").css("visibility", "hidden");
      $("#countValueType").hide();
      $("#countValueType").css("visibility", "hidden");
    } else if (selValue == "CensusTracts") {
      $("#bgValueType").hide();
      $("#bgValueType").css("visibility", "hidden");
      $("#ctValueType").show();
      $("#ctValueType").css("visibility", "visible");
      $("#countValueType").hide();
      $("#countValueType").css("visibility", "hidden");
    } else if (selValue == "County") {
      $("#bgValueType").hide();
      $("#bgValueType").css("visibility", "hidden");
      $("#ctValueType").hide();
      $("#ctValueType").css("visibility", "hidden");
      $("#countValueType").show();
      $("#countValueType").css("visibility", "visible");
    }
  }); //Dropdown for the reporting "widget"

  $("#boundary").change(function () {
    var selValue = $("#boundary").val();

    if (selValue == "BlockGroups_1") {
      $("#bgAttSelect").show();
      $("#bgAttSelect").css("visibility", "visible");
      $("#ctAttSelect").hide();
      $("#ctAttSelect").css("visibility", "hidden");
      $("#countyAttSelect").hide();
      $("#countyAttSelect").css("visibility", "hidden");
    } else if (selValue == "CensusTracts_1") {
      $("#bgAttSelect").hide();
      $("#bgAttSelect").css("visibility", "hidden");
      $("#ctAttSelect").show();
      $("#ctAttSelect").css("visibility", "visible");
      $("#countyAttSelect").hide();
      $("#countyAttSelect").css("visibility", "hidden");
    } else if (selValue == "County_1") {
      $("#bgAttSelect").hide();
      $("#bgAttSelect").css("visibility", "hidden");
      $("#ctAttSelect").hide();
      $("#ctAttSelect").css("visibility", "hidden");
      $("#countyAttSelect").show();
      $("#countyAttSelect").css("visibility", "visible");
    }
  }); //=================================
  //Determine the value to apply for the filter

  $("#queryResults").click(function () {
    var selValue = $("#boundaryType").val();

    if (selValue == "County") {
      var value = $("#countValueType").val();
      view.whenLayerView(county).then(function (layerView) {
        var countyLayerView = layerView;
        countyLayerView.effect = {
          filter: {
            where: "Name = '" + value + " County'"
          },
          excludedEffect: "grayscale(100%) opacity(50%)"
        };
      });
    } else if (selValue == "CensusTracts") {
      var ctValue = $("#ctValueType").val();
      view.whenLayerView(censusTracts).then(function (layerView) {
        layerView.effect = {
          filter: {
            where: "Tract = '" + ctValue + "'"
          },
          excludedEffect: "opacity(0%)"
        };
      });
    } else if (selValue == "BlockGroups") {
      var bgValue = $("#bgValueType").val();
      view.whenLayerView(censusBlocks).then(function (layerView) {
        layerView.effect = {
          filter: {
            where: "Block_Group = '" + bgValue + "'"
          },
          excludedEffect: "opacity(0%)"
        };
      });
    }
  });
  $("#clearResults").click(function () {
    view.whenLayerView(county).then(function (layerView) {
      var countyLayerView = layerView;
      countyLayerView.effect = null;
    });
    view.whenLayerView(censusTracts).then(function (layerView) {
      layerView.effect = null;
    });
    view.whenLayerView(censusBlocks).then(function (layerView) {
      layerView.effect = null;
    });
  }); //=============================
  //Testing the creation of a grid table

  var gridDiv = document.getElementById("reportList");
  var gridFields = ["__OBJECTID", "tp_1980", "tp_1990", "tp_2000", "tp_2010", "Pop_Total", "Pop_White", "Pop_Black", "Pop_Hispanic", "Pop_Asian", "Pop_Other", "Auto_0_Car", "Auto_1_Car", "Auto_2_Car", "Auto_3_Car", "Auto_4Plus_Car", "Age_Under_5", "Age_5to17", "Age_18to34", "Age_35to64", "Age_65plus", "Edu_No_High_School", "Edu_High_School", "Edu_Associate", "Edu_Bachelors", "Edu_Graduate", "Lang_No_Eng", "Lang_Eng_Not_Well", "Lang_Eng_Well", "Lang_Eng_Very_Well", "Lang_Eng_Only", "Inc_Below_25", "Inc_25To50", "Inc_50To100", "Inc_Above_100", "Inc_HH_Median"];
  var grid, carGrid, ageGrid, educateGrid, langGrid, incomeGrid, populationGrid; //Create a new datastore for the on demandgrid

  var dataStore = new StoreAdapter({
    objectStore: new Memory({
      idProperty: "__OBJECTID"
    })
  }); //County query tasks

  var countyTask = new QueryTask({
    url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Counties/MapServer/0"
  }); //Block Group query tasks

  var blockTask = new QueryTask({
    url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Block_Groups/MapServer/0"
  }); //Census Tracts query tasks

  var tractTask = new QueryTask({
    url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Tracts/MapServer/0"
  });
  var params = new Query({
    returnGeometry: true
  });
  $("#doBtn").on("click", doQuery);

  function popGrid(response) {
    var graphics = response.features;
    createGrid(response.fields);
    var data = graphics.map(function (feature, i) {
      return Object.keys(feature.attributes).filter(function (key) {
        return gridFields.indexOf(key) !== -1;
      }).reduce(function (obj, key) {
        obj[key] = feature.attributes[key];
        return obj;
      }, {});
    });
    dataStore.objectStore.data = data;
    grid.set("collection", dataStore);
    carGrid.set("collection", dataStore);
    ageGrid.set("collection", dataStore);
    educateGrid.set("collection", dataStore);
    langGrid.set("collection", dataStore);
    incomeGrid.set("collection", dataStore);
    populationGrid.set("collection", dataStore);
  }

  function createGrid(fields) {
    var columns = fields.filter(function (field, i) {
      if (gridFields.indexOf(field.name) !== -1) {
        return field;
      }
    }).map(function (field) {
      if (field.name === "__OBJECTID") {
        return {
          field: field.name,
          label: field.name,
          sortable: true,
          hidden: true
        };
      } else {
        return {
          field: field.name,
          label: field.alias,
          sortable: true
        };
      }
    });
    grid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Pop_White": {
          "label": "White Population",
          "formatter": dojoNum.format
        },
        "Pop_Black": {
          "label": "Black Population",
          "formatter": dojoNum.format
        },
        "Pop_Hispanic": {
          "label": "Hispanic Population",
          "formatter": dojoNum.format
        },
        "Pop_Asian": {
          "label": "Asian Population",
          "formatter": dojoNum.format
        },
        "Pop_Other": {
          "label": "Other Population",
          "formatter": dojoNum.format
        }
      }
    }, "grid");
    ageGrid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Age_Under_5": {
          "label": "5 & Under",
          "formatter": dojoNum.format
        },
        "Age_5to17": {
          "label": "5 to 17",
          "formatter": dojoNum.format
        },
        "Age_18to34": {
          "label": "18 to 34",
          "formatter": dojoNum.format
        },
        "Age_35to64": {
          "label": "35 to 64",
          "formatter": dojoNum.format
        },
        "Age_65plus": {
          "label": "65 & Older",
          "formatter": dojoNum.format
        }
      }
    }, "agegrid");
    carGrid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Auto_0_Car": {
          "label": "No Cars",
          "formatter": dojoNum.format
        },
        "Auto_1_Car": {
          "label": "1 Car",
          "formatter": dojoNum.format
        },
        "Auto_2_Car": {
          "label": "2 Cars",
          "formatter": dojoNum.format
        },
        "Auto_3_Car": {
          "label": "3 Cars",
          "formatter": dojoNum.format
        },
        "Auto_4Plus_Car": {
          "label": "4+ Cars",
          "formatter": dojoNum.format
        }
      }
    }, "cargrid");
    educateGrid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Edu_No_High_School": {
          "label": "No High School",
          "formatter": dojoNum.format
        },
        "Edu_High_School": {
          "label": "Only High School",
          "formatter": dojoNum.format
        },
        "Edu_Associate": {
          "label": "Associate's Degree",
          "formatter": dojoNum.format
        },
        "Edu_Bachelors": {
          "label": "Bachelor's Degree",
          "formatter": dojoNum.format
        },
        "Edu_Graduate": {
          "label": "Graduate Degree",
          "formatter": dojoNum.format
        }
      }
    }, "educationgrid");
    langGrid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Lang_No_Eng": {
          "label": "No English",
          "formatter": dojoNum.format
        },
        "Lang_Eng_Not_Well": {
          "label": "English Not Well",
          "formatter": dojoNum.format
        },
        "Lang_Eng_Well": {
          "label": "English Well",
          "formatter": dojoNum.format
        },
        "Lang_Eng_Very_Well": {
          "label": "English Very Well",
          "formatter": dojoNum.format
        },
        "Lang_Eng_Only": {
          "label": "English Only",
          "formatter": dojoNum.format
        }
      }
    }, "langgrid");
    incomeGrid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Inc_Below_25": {
          "label": "Income Below 25K",
          "formatter": dojoNum.format
        },
        "Inc_25To50": {
          "label": "Income Between 25 & 50K",
          "formatter": dojoNum.format
        },
        "Inc_50To100": {
          "label": "Income Between 50 & 100K",
          "formatter": dojoNum.format
        },
        "Inc_Above_100": {
          "label": "Income Above 100k",
          "formatter": dojoNum.format
        },
        "Inc_HH_Median": {
          "label": "Median Household Income",
          "formatter": dojoNum.format
        }
      }
    }, "incomegrid");
    populationGrid = new (declare([OnDemandGrid, Selection]))({
      columns: {
        "Pop_Total": {
          "label": "Current Total Population",
          "formatter": dojoNum.format
        },
        "tp_2010": {
          "label": "Total Population in 2010",
          "formatter": dojoNum.format
        },
        "tp_2000": {
          "label": "Total Population in 2000",
          "formatter": dojoNum.format
        },
        "tp_1990": {
          "label": "Total Population in 1990",
          "formatter": dojoNum.format
        },
        "tp_1980": {
          "label": "Total Population in 1980",
          "formatter": dojoNum.format
        }
      }
    }, "populationgrid");
  }

  function doClear() {
    if (grid && carGrid && ageGrid && educateGrid) {
      dataStore.objectStore.data = {};
      grid.set("collection", dataStore);
      carGrid.set("collection", dataStore);
      ageGrid.set("collection", dataStore);
      educateGrid.set("collection", dataStore);
      langGrid.set("collection", dataStore);
      incomeGrid.set("collection", dataStore);
      populationGrid.set("collection", dataStore);
    }
  }

  function doQuery() {
    doClear();
    var boundaryValue = $("#boundary").val();

    if (boundaryValue == "BlockGroups_1") {
      var attributeName = $("#bgAttSelect").val();
      params.where = "Block_Group = '" + attributeName + "'";
      params.outFields = ["*"];
      blockTask.execute(params).then(popGrid);
    } else if (boundaryValue == "CensusTracts_1") {
      var ctAttributeName = $("#ctAttSelect").val();
      params.where = "Tract = '" + ctAttributeName + "'";
      params.outFields = ["*"];
      tractTask.execute(params).then(popGrid);
    } else if (boundaryValue == "County_1") {
      var countyAttributeName = $("#countyAttSelect").val();
      params.where = "Name = '" + countyAttributeName + " County'";
      console.log(params.where);
      params.outFields = ["*"];
      countyTask.execute(params).then(popGrid);
    }
  } //Export the grid table to a CSV file


  $("#export").on("click", function () {
    customExportCSV(dataStore);
  });

  function customExportCSV(evt) {
    var data = evt.objectStore.data;
    console.log(data);
    var csv = convertArrayOfObjectsToCSV({
      data: data
    });
    csv = "data:text/csv;charset=utf-8," + csv;
    var encodedUri = encodeURI(csv);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DemographicReport.csv");
    link.click();
  }

  function convertArrayOfObjectsToCSV(value) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = value.data || null;

    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = value.columnDelimiter || ",";
    lineDelimiter = value.lineDelimiter || "\n";
    keys = Object.keys(data["0"]);
    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        result += item[key];
        result += columnDelimiter;
      });
      result += lineDelimiter;
    });
    return result;
  } //=========================================
  //Create the ability to have the user create new symbology


  $("#category").change(function () {
    var catValue = $("#category").val();

    if (catValue == 1) {
      $("#placeHolder").hide();
      $("#raceField-select").show();
      $("#raceField-select").css("visibility", "visible");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#raceField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#raceField-select").change(function () {
        field = $("#raceField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 2) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").show();
      $("#ageField-select").css("visibility", "visible");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#ageField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#ageField-select").change(function () {
        field = $("#ageField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 3) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").show();
      $("#householdField-select").css("visibility", "visible");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#householdField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#householdField-select").change(function () {
        field = $("#householdField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 4) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").show();
      $("#educationField-select").css("visibility", "visible");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#educationField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#educationField-select").change(function () {
        field = $("#educationField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 5) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").show();
      $("#transportationField-select").css("visibility", "visible");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#transportationField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#transportationField-select").change(function () {
        field = $("#transportationField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 6) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").show();
      $("#housingField-select").css("visibility", "visible");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#housingField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#housingField-select").change(function () {
        field = $("#housingField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 7) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").show();
      $("#povertyField-select").css("visibility", "visible");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#povertyField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#povertyField-select").change(function () {
        field = $("#povertyField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 8) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").show();
      $("#travelField-select").css("visibility", "visible");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#travelField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#travelField-select").change(function () {
        field = $("#travelField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 9) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").show();
      $("#languageField-select").css("visibility", "visible");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#languageField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#languageField-select").change(function () {
        field = $("#languageField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 10) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").show();
      $("#autoField-select").css("visibility", "visible");
      $("#unemployField-select").hide();
      $("#unemployField-select").css("visibility", "hidden"); //initial map display

      var field = $("#autoField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#autoField-select").change(function () {
        field = $("#autoField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    } else if (catValue == 11) {
      $("#placeHolder").hide();
      $("#raceField-select").hide();
      $("#raceField-select").css("visibility", "hidden");
      $("#ageField-select").hide();
      $("#ageField-select").css("visibility", "hidden");
      $("#householdField-select").hide();
      $("#householdField-select").css("visibility", "hidden");
      $("#educationField-select").hide();
      $("#educationField-select").css("visibility", "hidden");
      $("#transportationField-select").hide();
      $("#transportationField-select").css("visibility", "hidden");
      $("#housingField-select").hide();
      $("#housingField-select").css("visibility", "hidden");
      $("#povertyField-select").hide();
      $("#povertyField-select").css("visibility", "hidden");
      $("#travelField-select").hide();
      $("#travelField-select").css("visibility", "hidden");
      $("#languageField-select").hide();
      $("#languageField-select").css("visibility", "hidden");
      $("#autoField-select").hide();
      $("#autoField-select").css("visibility", "hidden");
      $("#unemployField-select").show();
      $("#unemployField-select").css("visibility", "visible"); //initial map display

      var field = $("#unemployField-select").val();
      var classField = $("#class-select").val();
      var boundaryLayer = $("#boundaryDecision").val();
      $("#unemployField-select").change(function () {
        field = $("#unemployField-select").val();
      });
      $("#class-select").change(function () {
        classField = $("#class-select").val();
      });
      $("#boundaryDecision").change(function () {
        boundaryLayer = $("#boundaryDecision").val();
      });
      $("#classBtn").on("click", function () {
        if (boundaryLayer == "county") {
          countyRenderer(field, classField);
        } else if (boundaryLayer == "censusBlocks") {
          blockRenderer(field, classField);
        } else if (boundaryLayer == "censusTracts") {
          tractRenderer(field, classField);
        }
      });
      $("#clearBtn").on("click", function () {
        county.renderer = countRenderer;
        censusBlocks.renderer = bgRenderer;
        censusTracts.renderer = ctRenderer;
      });
    }
  }); //Create the function for the county class breaks renderer

  function countyRenderer(field, classField) {
    //Insert the selected field into the legend text function
    var text = legendText(field); //Parameters for the class breaks renderer

    var params = {
      layer: county,
      field: field,
      basemap: map.basemap,
      classificationMethod: classField,
      numClasses: 4,
      legendOptions: {
        title: text
      }
    }; //generate the renderer

    colorRendererCreator.createClassBreaksRenderer(params).then(function (response) {
      county.renderer = response.renderer;

      if (!county.visible) {
        county.visible = true;
        censusTracts.visible = false;
        censusBlocks.visible = false;
      }
    });
  } //Create the function for the block group class breaks renderer


  function blockRenderer(field, classField) {
    //Insert the selected field into the legend text function
    var text = legendText(field); //Parameters for the class breaks renderer

    var params = {
      layer: censusBlocks,
      field: field,
      basemap: map.basemap,
      classificationMethod: classField,
      numClasses: 4,
      legendOptions: {
        title: text
      }
    }; //Generate the renderer

    colorRendererCreator.createClassBreaksRenderer(params).then(function (response) {
      censusBlocks.renderer = response.renderer;

      if (!censusBlocks.visible) {
        county.visible = false;
        censusTracts.visible = false;
        censusBlocks.visible = true;
      }
    });
  } //Create the function for the census tracts class breaks renderer


  function tractRenderer(field, classField) {
    //Insert the selected field into the legend text function
    var text = legendText(field); //Parameters for the class breaks renderer

    var params = {
      layer: censusTracts,
      field: field,
      basemap: map.basemap,
      classificationMethod: classField,
      numClasses: 4,
      legendOptions: {
        title: text
      }
    }; //Generate the renderer

    colorRendererCreator.createClassBreaksRenderer(params).then(function (response) {
      censusTracts.renderer = response.renderer;

      if (!censusTracts.visible) {
        county.visible = false;
        censusTracts.visible = true;
        censusBlocks.visible = false;
      }
    });
  } //Create a function to determine which text to use for the legend


  function legendText(field) {
    var text; //Create a readable description for the legend

    if (field == "Pop_White") {
      return text = "Number of People who are White";
    } else if (field == "Pop_Black") {
      return text = "Number of People who are Black";
    } else if (field == "Pop_Hispanic") {
      return text = "Number of People who are Hispanic";
    } else if (field == "Pop_Asian") {
      return text = "Number of People who are Asian";
    } else if (field == "Pop_Other") {
      return text = "Number of People who are of Other Race";
    } else if (field == "Age_Under_5") {
      return text = "Number of People who are Under 5";
    } else if (field == "Age_5to17") {
      return text = "Number of People who are 5 to 17";
    } else if (field == "Age_18to34") {
      return text = "Number of People who are 18 to 34";
    } else if (field == "Age_35to64") {
      return text = "Number of People who are 35 to 64";
    } else if (field == "Age_65plus") {
      return text = "Number of People who are 65 and Older";
    } else if (field == "Inc_Below_25") {
      return text = "Number of Households that have an Income under 25K";
    } else if (field == "Inc_25To50") {
      return text = "Number of Households that have an Income between 25K and 50K";
    } else if (field == "Inc_50To100") {
      return text = "Number of Households that have an Income between 50K and 100K";
    } else if (field == "Inc_HH_Median") {
      return text = "Household Median Income";
    } else if (field == "Inc_Above_100") {
      return text = "Number of Households that have an Income above 100K";
    } else if (field == "Edu_No_High_School") {
      return text = "Number of People who have No High School Education";
    } else if (field == "Edu_High_School") {
      return text = "Number of People who only have a High School Education";
    } else if (field == "Edu_Associate") {
      return text = "Number of People who have an Associate's Degree";
    } else if (field == "Edu_Bachelors") {
      return text = "Number of People who have a Bachelor's Degree";
    } else if (field == "Edu_Graduate") {
      return text = "Number of People who have a Graduate's Degree";
    } else if (field == "Mot_Carpool") {
      return text = "Number of People who Carpool to Work";
    } else if (field == "Mot_Drove_Alone") {
      return text = "Number of People who Drove Alone to Work";
    } else if (field == "Mot_Other") {
      return text = "Number of People who Took Other Ways to Work";
    } else if (field == "Mot_Pedbike") {
      return text = "Number of People who Rode a Bicycle to Work";
    } else if (field == "Mot_Telework") {
      return text = "Number of People who Telework";
    } else if (field == "Mot_Transit") {
      return text = "Number of People who Took Public Transit to Work";
    } else if (field == "H_Owner") {
      return text = "Number of People who are a Home Owner";
    } else if (field == "H_Renter") {
      return text = "Number of People who Rent their Home";
    } else if (field == "Med_Hu_val") {
      return text = "Median House Cost";
    } else if (field == "Pov_Above") {
      return text = "Number of Households that are Above the Poverty Rate";
    } else if (field == "Pov_Below") {
      return text = "Number of Households that are Below the Poverty Rate";
    } else if (field == "Pov_Rate") {
      return text = "Poverty Rate";
    } else if (field == "Ttw_Below_5") {
      return text = "Number of People who it takes Less than 5 mins to get to work";
    } else if (field == "Ttw_5To15") {
      return text = "Number of People who it takes 5 to 15 mins to get to work";
    } else if (field == "Ttw_15To30") {
      return text = "Number of People who it takes 15 to 30 mins to get to work";
    } else if (field == "Ttw_30To60") {
      return text = "Number of People who it takes 30 to 60 mins to get to work";
    } else if (field == "Ttw_60Plus") {
      return text = "Number of People who it takes 60 mins or more to get to work";
    } else if (field == "M_Travtime") {
      return text = "Average Travel Time to Work";
    } else if (field == "Lang_No_Eng") {
      return text = "Number of People who Speaks No English";
    } else if (field == "Lang_Eng_Not_Well") {
      return text = "Number of People who Speaks English Not Well";
    } else if (field == "Lang_Eng_Well") {
      return text = "Number of People who Speaks English Well";
    } else if (field == "Lang_Eng_Very_Well") {
      return text = "Number of People who Speaks English Very Well";
    } else if (field == "Lang_Eng_Only") {
      return text = "Number of People who Only Speaks English";
    } else if (field == "Auto_0_Car") {
      return text = "Number of Households that don't Own a Car";
    } else if (field == "Auto_1_Car") {
      return text = "Number of Households that Own 1 Car";
    } else if (field == "Auto_2_Car") {
      return text = "Number of Households that Own 2 Cars";
    } else if (field == "Auto_3_Car") {
      return text = "Number of Households that Own 3 Cars";
    } else if (field == "Auto_4Plus_Car") {
      return text = "Number of Households that Own 4 or More Cars";
    } else if (field == "Unemp_Rate") {
      return text = "Unemployment Rate";
    }
  }
});
//# sourceMappingURL=main.js.map
