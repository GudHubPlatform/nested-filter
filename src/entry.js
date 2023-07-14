import './static_nested_list.webcomponent.js';

export default class StaticNestedListData {

    /*------------------------------- FIELD TEMPLATE --------------------------------------*/

    getTemplate() {
        return {
            constructor: 'field',
            name: 'Nested List',
            icon: 'scheduling',
            model: {
                field_id: 0,
                field_name: 'Nested List',
                name_space: 'static_nested_list',
                field_value: '',
                data_type: 'static_nested_list',
                data_model: {
                    app_id: '',
                    options: [],
                    interpretation: [{
                        src: 'form',
                        id: 'default',
                        settings: {
                            editable: 1,
                            show_field_name: 1,
                            show_field: 1
                        }
                    }]
                }
            }
        };
    }

    /*------------------------------- INTERPRETATION --------------------------------------*/

    getInterpretation(gudhub, value, appId, itemId, field_model) {

        return [{
            id: 'default',
            name: 'Default',
            content: () =>
                '<static-nested-list app-id="{{appId}}" item-id="{{itemId}}" field-id="{{fieldId}}"></static-nested-list>'
        }, {
            id: 'value',
            name: 'Value',
            content: () => value
        }];
    }

    /*--------------------------  SETTINGS --------------------------------*/

    getSettings(scope) {
        return [{
            title: 'Options',
            type: 'general_setting',
            icon: 'menu',
            columns_list: [
                [
                    {
                        type: 'ghElement',
                        property: 'data_model.app_id',
                        data_model: function () {
                            return {
                                field_name: 'App Id',
                                name_space: 'app_id',
                                data_type: 'app',
                                data_model: {
                                    interpretation : [{
                                        src: 'form',
                                        id: 'with_text',
                                        settings:{
                                            editable: 1,
                                            show_field_name: 1,
                                            show_field: 1
                                        }
                                    }]
                                }
                            };
                        }
                    },
                    {
                      type: "ghElement",
                      property: "data_model.table_field_id",
        
                      data_model: async function(fieldModel) {
                        var model = {
                          data_model: {
                            options: [],
                            show_field_name: true
                          },
                          field_name: "Bind to table",
                          data_type: "text_opt"
                        };
        
                        let fieldList = await gudhub.getFieldModels(scope.appId);
        
                        model.data_model.options = fieldList
                              .filter(function(field) {
                                return (
                                  field.data_type == "table" ||
                                  field.data_type == "cards"
                                );
                              })
                              .map(function(field) {
                                return {
                                  name: field.field_name,
                                  value: field.field_id,
                                  app_id: field.data_model.app_id,
                                  field_id: field.field_id
                                };
                              });
        
                        return model;
                      },
                      onInit: function(scope, fieldModel) {
                        scope.$watch(
                          function() {
                            return scope.fieldModel.data_model.app_id;
                          },
                          function(newValue, oldValue) {
                            if (newValue) {
                              if (!fieldModel.data_model.filter_settings) {
                                fieldModel.data_model.filter_settings = {
                                  fields_to_view: []
                                };
                              }
        
                              gudhub.util.createFieldsListToView(
                                newValue || scope.appId,
                                fieldModel.data_model.filter_settings.fields_to_view
                              ).then(function(columnsList) {
                                fieldModel.data_model.filter_settings.fields_to_view = [];
        
                                angular.forEach(angular.copy(columnsList), function(
                                  value
                                ) {
                                  fieldModel.data_model.filter_settings.fields_to_view.push(
                                    {
                                      field_id: value.field_id,
                                      show: value.show
                                    }
                                  );
                                });
                              });
                            } else {
                              fieldModel.data_model.filter_settings.fields_to_view = [];
                            }
                          }
                        );
                      }
                    },
                    {
                        type: 'ghElement',
                        property: 'data_model.show_icon',
                        data_model: function () {
                            return {
                                field_name: 'Show Icon',
                                name_space: 'show_icon',
                                data_type: 'boolean'
                            };
                        }
                    },
                    {
                        type: "ghElement",
                        property: "data_model.folder_icon",
                        showIf: "data_model.show_icon",
                        data_model() {
                          return {
                            field_name: "Folder Icon",
                            name_space: "folder_icon",
                            data_type: "icon",
                            data_model: {
                                interpretation: [{
                                    src: 'form',
                                    id: 'default',
                                    settings: {
                                        editable: 1,
                                        show_field_name: 1,
                                        show_field: 1,
                                    }
                                }],
                            }
                          };
                        },
                    },
                    {
                        type: "ghElement",
                        property: "data_model.item_icon",
                        showIf: "data_model.show_icon",
                        data_model() {
                          return {
                            field_name: "Item Icon",
                            name_space: "item_icon",
                            data_type: "icon",
                            data_model: {
                                interpretation: [{
                                    src: 'form',
                                    id: 'default',
                                    settings: {
                                        editable: 1,
                                        show_field_name: 1,
                                        show_field: 1,
                                    }
                                }]
                            }
                          };
                        },
                    },
                ],
                [
                    {
                        title: "Data Settings",
                        type: "header",
                        class: "option-column_750px"
                      },
                      {
                        type: "html",
                        data_model: function(fieldModel) {
                          return {
                            patterns: [
                              {
                                property: "name",
                                prop_name: "name",
                                type: "text",
                                data_model: function(option) {
                                  return {
                                    emoji_button: 1
                                  };
                                },
                                display: true
                              },
                              {
                                property: 'parent',
                                type: "text_opt",
                                prop_name: 'Parent',
                                data_model: (option) => {
                                  return {
                                    options: fieldModel.data_model.options.map((setting, index) => {
                                        return {
                                            name: setting.name,
                                            value: index
                                        }
                                    }).filter(el => el.name !== option.name)
                                  }
                                },
                                display: true
                              },
                              {
                                property: "filters_list",
                                prop_name: "Filter",
                                type: "filter_table",
                                display: true,
                                data_model: function(option, scope) {
                                  scope.appId = fieldModel.data_model.app_id;
          
                                  option.filters_list
                                    ? (scope.filters_list = option.filters_list)
                                    : (scope.filters_list = option.filters_list = []);
                                  return {
                                    mode: "variable"
                                  };
                                }
                              }
                            ]
                          };
                        },
                        control:
                          '<gh-option-table items="fieldModel.data_model.options" pattern="field_model.patterns" ></gh-option-table>'
                      }
                ]
            ]
        }];
    }
}