//设置全局地址
axios.get('/dpapi/getPath')
    .then(function(res){
        Vue.http.options.root = res.data;
}.bind(this),function(error){
        console.log(error)
});

$('#oscar-nav-btn').click(function () {
    $('.dada2').toggle();
});

//引入上导航
$("#header_box").load("../../templates/header_box.html");

//退出登录
function logOut(){
    $('#login-out-form')[0].submit();
}
//axios默认设置cookie
axios.defaults.withCredentials = true;
var menuData=[];
axios.get(baseUrl+'/api/getMenu')				
    .then(function(res){
        for(var i=0;i<res.data.result.length;i++){
            var obj=res.data.result[i];
            menuData.push({
                "index":obj.index,
                "resourceinfo":obj.resourceinfo,
                "children":obj.children,
                "url":obj.url,
            });
    }
}.bind(this),function(error){
    console.log(error);
    window.location.href = baseUrl+"/templates/login.html";
});   

// 定义树节点
var treeMenuTemplate = [];
treeMenuTemplate.push('<li class="el-submenu" :class="[open ? \'\': \'\', selected ? \'is-active\':\'\']">');
treeMenuTemplate.push('<a class="db el-submenu__title" :id="model.index" @click="toggle" v-menu-animation="open" :style="{paddingLeft: paddingLeft + \'px\'}" :href="getUrl">');
treeMenuTemplate.push('<i class="el-icon-message" v-if="level == 1"></i>');
treeMenuTemplate.push('<template v-if="hasChildren()">');
treeMenuTemplate.push('<i class="el-submenu__icon-arrow" :class="[open ? \'el-icon-arrow-up\': \'el-icon-arrow-down\']"></i>');
treeMenuTemplate.push('</template>');
treeMenuTemplate.push('{{ model.resourceinfo }}');
treeMenuTemplate.push('</a>');
treeMenuTemplate.push('<ul class="el-menu" :class="[open ? \'\' : \'dn\']" v-if="hasChildren()">');
treeMenuTemplate.push('<tree-menu v-for="item in model.children" :model="item" :level="level + 1" :theId="theId"></tree-menu>');
treeMenuTemplate.push('</ul>');
treeMenuTemplate.push('</li>');

 Vue.component('tree-menu', {
    template: treeMenuTemplate.join(''),

    created: function () {
        // debugger;
        var index = this.model.index;
        var hasIndex = this.theId.search(index);
        var lala = index.replace(this.theId, '');
        if (hasIndex == 0) {
            this.open = true;
        }
        if (hasIndex == 0 && lala.length == 0) {
            this.selected = true;
        }
    },

    props: ['model', 'level', 'theId'],

    computed: {
        getUrl: function () {
            if (this.hasChildren()) {
                return "javascript:;";
            }
            var realUrl="";
            // 1
            if(this.model.url=="/home"){
                realUrl=baseUrl+"/templates/home.html"
            }
            // 2
            else if(this.model.url=="/digitalplan/advancedsearch"){
                realUrl=baseUrl+"/templates/digitalplan/advancedsearch.html"
            }
            // 3
            else if(this.model.url=="/digitalplan/digitalplan"){
                realUrl=baseUrl+"/templates/digitalplan/digitalplan_list.html"
            }
            else if(this.model.url=="/digitalplan/guardobjectsplan"){
                realUrl=baseUrl+"/templates/digitalplan/guardobjectsplan_list.html"
            }
            else if(this.model.url=="/digitalplan/otherobjectsplan"){
                realUrl=baseUrl+"/templates/digitalplan/otherobjectsplan_list.html"
            }
            else if(this.model.url=="/digitalplan/digitalplan_approve"){
                realUrl=baseUrl+"/templates/digitalplan/digitalplan_approve.html"
            }
            else if(this.model.url=="/digitalplan/digitalplan_distribute"){
                realUrl=baseUrl+"/templates/digitalplan/digitalplan_distribute.html"
            }
            // 4
            else if(this.model.url=="/planobject/importantunits"){
                realUrl=baseUrl+"/templates/planobject/importantunits_list.html"
            }
            else if(this.model.url=="/planobject/otherobjects"){
                realUrl=baseUrl+"/templates/planobject/otherobjects_list.html"
            }
            else if(this.model.url=="/planobject/guardobjects"){
                realUrl=baseUrl+"/templates/planobject/guardobjects_list.html"
            }
            // 5
            else if(this.model.url=="/building_zoning"){
                realUrl=baseUrl+"/templates/buildingzoning/building_zoning_list.html"
            }
            // 6
            else if(this.model.url=="/basicinfo/firewater"){
                realUrl=baseUrl+"/templates/basicinfo/firewater_list.html"
            }
            else if(this.model.url=="/basicinfo/equipment"){
                realUrl=baseUrl+"/templates/basicinfo/equipment_list.html"
            }
            else if(this.model.url=="/basicinfo/equipmentstock"){
                realUrl=baseUrl+"/templates/basicinfo/equipmentstock_list.html"
            }
            else if(this.model.url=="/basicinfo/fireengine"){
                realUrl=baseUrl+"/templates/basicinfo/fireengine_list.html"
            }
            else if(this.model.url=="/basicinfo/firedrug"){
                realUrl=baseUrl+"/templates/basicinfo/firedrug_list.html"
            }
            else if(this.model.url=="/basicinfo/firestation"){
                realUrl=baseUrl+"/templates/basicinfo/firestation_list.html"
            }
            // 7
            else if(this.model.url=="/auxiliarydecision/danger"){
                realUrl=baseUrl+"/templates/auxiliarydecision/danger_list.html"
            }
            else if(this.model.url=="/auxiliarydecision/firecalculation"){
                realUrl=baseUrl+"/templates/auxiliarydecision/firecalculation_list.html"
            }
            // 8
            else if(this.model.url=="/report/report1"){
                realUrl=baseUrl+"/templates/report/report1.html"
            }
            else if(this.model.url=="/report/report3"){
                realUrl=baseUrl+"/templates/report/report3.html"
            }
            // 9
            else if(this.model.url=="/user"){
                realUrl=baseUrl+"/templates/system/user_list.html";
            }
            else if(this.model.url=="/role"){
                realUrl=baseUrl+"/templates/system/role_list.html"
            }
            else if(this.model.url=="/permission"){
                realUrl=baseUrl+"/templates/system/permission_list.html"
            }
            else if(this.model.url=="/resource"){
                realUrl=baseUrl+"/templates/system/resource_list.html"
            }
            else if(this.model.url=="/codelist"){
                realUrl=baseUrl+"/templates/system/codelist_list.html"
            }
            else if(this.model.url=="/imgupload"){
                realUrl=baseUrl+"/templates/system/imgupload_list.html"
            }
            else if(this.model.url=="/basicinfo/organization"){
                realUrl=baseUrl+"/templates/system/organization_list.html"
            }
            //10
            else if(this.model.url=="/jxcsplan/jxcsplan_approve"){
                realUrl=baseUrl+"/templates/jxcsplan/jxcsplan_approve.html"
            }
            return realUrl+"?index="+this.model.index;
        }
    },

    data: function () {
        return {
            open: false,
            paddingLeft: this.level * 20,
            selected: false,
            
        };
    },

    methods: {
        hasChildren: function () {
            return this.model.children && this.model.children.length;
        },

        toggle: function () {
            /**菜单手风琴 by yushch 20180620 */
            /** 
            if (this.hasChildren()) {
                this.open = !this.open;
            }
            */
           var p = this.$parent.$children;
           for(var i=0;i<p.length;i++){
                if(p[i] !== this)
                   p[i].open = false;
           }
           if (this.hasChildren()) {
                this.open = !this.open;
            }
        },
    }

});

Vue.directive('menu-animation', function (el, binding) {
    var open = (binding.value);
    var ulElement = $(el).parent().children('ul');
    if (open) {
        ulElement.slideDown(200);
    } else {
        ulElement.slideUp(200);
    }
});

// 定义外围树
var bigTreeTemplate = [];
bigTreeTemplate.push('<div class="tree-menu">');
bigTreeTemplate.push('<ul v-for="menuItem in theModel" class="el-menu">');
bigTreeTemplate.push('<tree-menu :model="menuItem" :level="theLevel" :theId="defaultActive"></tree-menu>');
bigTreeTemplate.push('</ul>');
bigTreeTemplate.push('</div>');

Vue.component('big-tree', {
    template: bigTreeTemplate.join(''),
    
    props: ['defaultActive'],

    created: function () {
        var value = $("#activeIndex").val();
        this.defaultActive = value;
    },

    data: function () {
        return {
            theModel: menuData,
            theLevel: 1,
            //菜单选中
            activeIndex: '1',
        };
    },


});

var bigTree = Vue.extend({
   
});

new bigTree().$mount('big-tree');
//左侧菜单的开合
$('#menu-toggle-btn').click(function () {
    var left = $('.left-sidebar'),
        main = $('.main-box'),
        $this = $(this);
    if (left.hasClass('damin')) {
        left.removeClass('damin').css('left', '0');
        main.css('padding-left', '240px');
        setTimeout(function () {
            $this.removeClass('menu-toggle-bg').css({ "right": "0", "transform": "rotateY(0)" });
        }, 300);
    } else {
        left.addClass('damin').css('left', '-240px');
        main.css('padding-left', 0);
        setTimeout(function () {
            $this.addClass('menu-toggle-bg').css({ "right": "-26px", "transform": "rotateY(180deg)" });
        }, 300);
    }
});

