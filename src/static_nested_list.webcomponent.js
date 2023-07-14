import GhHtmlElement from "@gudhub/gh-html-element";
import $ from 'jquery';
import 'jstree';
import './style.scss';

class StaticNestedList extends GhHtmlElement {

    // Constructor with super() is required for native web component initialization

    constructor() {
        super();
    }

    // onInit() is called after parent gh-element scope is ready

    async onInit() {
        super.render(this);

        const self = this;
        
        const iconStorage = gudhub.ghconstructor.angularInjector.get('iconsStorage');
        this.folderIcon = await iconStorage.getCanvasIcon(this.scope.field_model.data_model.folder_icon, '0D99FF', '12px');
        this.itemIcon = await iconStorage.getCanvasIcon(this.scope.field_model.data_model.item_icon, '0D99FF', '28px');
        let optionsClone = structuredClone(this.scope.field_model.data_model.options);
        const data = optionsClone.map((option, index) => {
            return {
                id: index,
                parent: option.parent ? option.parent : '#',
                text: option.name,
                data: option.filters_list
            }
        });

        $(this).jstree({
            core : {
              data
            },
            plugins: ['wholerow', 'state']
        });

        $(this).on('ready.jstree', function (event, data) {
            let instance = $(self).jstree(true);
  
            let list = instance.get_json('#', {flat:false});
            if(self.scope.field_model.data_model.show_icon) {
              self.setIconForElements(list, instance);
            } else {
              instance.hide_icons();
            }
        });

        $(this).on("select_node.jstree", function (e, selected) {
          const filter = this.mergeFilters(selected.node);
          
          if (this.scope.field_model.data_model.app_id && this.scope.field_model.data_model.table_field_id) {
            gudhub.emit("filter", { app_id: this.scope.field_model.data_model.app_id, field_id: this.scope.field_model.data_model.table_field_id }, 
            selected.node.data)
          }

        });

    }

    mergeFilters(currentNode) {
      let parent = $(this).jstree(true).get_node(currentNode.parent);
      return gudhub.mergeObjects(parent.data, currentNode.data);
    }

    setIconForElements(elements, tree) {
        let isParentHasChildren;
        for(let i = 0; i < elements.length; i++) {
          isParentHasChildren = elements[i].children.length > 0;
          if(isParentHasChildren) {
            this.setIconForElements(elements[i].children, tree);
            tree.set_icon(elements[i], this.folderIcon.toDataURL());
          } else {
            tree.set_icon(elements[i], this.itemIcon.toDataURL());
          }
        }
      }

    // onUpdate() is called after value was updated

    onUpdate() {
        super.render();
    }

    // save() is called on input value change

    save() {
        
    }

}

// Register web component only if it is not registered yet

if(!customElements.get('static-nested-list')){
    customElements.define('static-nested-list', StaticNestedList);
}