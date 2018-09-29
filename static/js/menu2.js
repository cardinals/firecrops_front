//设置全局地址
axios.get('/dpapi/getPath').then(function(res){
    Vue.http.options.root = res.data;
}.bind(this),function(error){
    console.log(error)
});

$('#oscar-nav-btn').click(function () {
    $('.dada2').toggle();
});

//引入上导航
// $("#header_box").load("../../templates/header_box.html");

//退出登录
function logOut(){
    $('#login-out-form')[0].submit();
}
//axios默认设置cookie
axios.defaults.withCredentials = true;
var menuData=[];

axios.get(baseUrl+'/api/getMenu').then(function(res){
        for(var i=0;i<res.data.result.length;i++){
            var obj=res.data.result[i];
            menuData.push({
                "index": obj.index,
                "resourceinfo": obj.resourceinfo,
                "children": obj.children,
                "url": obj.url,
                "icon": "background:url(../../static/images/" + obj.icon + ") no-repeat"
            });
    }
}.bind(this),function(error){
    console.log(error);
    window.location.href = baseUrl+"/templates/login.html";
});
//全局菜单
// Vue.prototype.menues = menuData;

//定义树节点
var treeMenuTemplate = [];
treeMenuTemplate.push('<li class="el-submenu" :class="[open ? \'\': \'\', selected ? \'is-active\':\'\']">');
treeMenuTemplate.push('<a class="db el-submenu__title" :id="model.index" @click="toggle" v-menu-animation="open" :style="{paddingLeft: paddingLeft + \'px\'}" href="javascript:;">');
treeMenuTemplate.push('<i v-if="level == 1" v-bind:style="model.icon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>');
// treeMenuTemplate.push('<i v-else style="background:url(../../static/images/menu/menu-child.png) no-repeat">&nbsp;&nbsp;&nbsp;&nbsp;</i>');
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
        /**跳转形式，非点击事件菜单选中  by li.xue 20180627 */
        if(this.theId == "-1"){
            var paramUrl = getQueryString("url");
            if(paramUrl == null){
                this.theId = "1";
            }else{
                for(var i=0;i<menuData.length;i++){
                    if(paramUrl == menuData[i].url){
                        this.theId = menuData[i].index;
                        break;
                    }else{
                        var tempChildren = menuData[i].children;
                        for(var j=0;j<tempChildren.length;j++){
                            if(paramUrl == tempChildren[j].url){
                                this.theId = tempChildren[j].index;
                                break;
                            }
                        }
                    }
                }
            }  
        }
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
                   /**清除菜单选中 by li.xue 20180627 */
                   p[i].selected = false;
                   var pm = p[i].$children;
                   for(var j=0;j<pm.length;j++){
                       if(pm[j].model.url != Vue.prototype.lastUrl){
                            pm[j].selected = false;
                       }
                   }
            }
            /**菜单动态跳转 by li.xue 20180627 */
            if (this.hasChildren()) {
                this.open = !this.open;
            }else{
                var url = this.model.url;
                var index = this.model.index;
                //定义全局菜单url
                Vue.prototype.lastUrl = url;
                //菜单选中
                this.selected = true;
                //更新地址栏
                if(url.indexOf('http')!= -1){
                    
                }
                var shortURL = window.location.href.substr(0, top.location.href.indexOf("?")) + "?url=" + url;
                //二维标绘
                if(url.indexOf('http')!= -1){
                    shortURL = window.location.href.substr(0, top.location.href.indexOf("?")) + "?url=/home";
                }
                // var shortURL = window.location.href.substr(0, top.location.href.indexOf("templates")+9) + url + '.html';style="padding-left:18%"
                history.replaceState(null, null, shortURL);
                 //判断是否为外挂链接(lxy20180912)
                if(url.indexOf('http')!= -1){
                    var html='<div class="main-box"><iframe src="'+url+'"   width="100%" height="100%"></iframe></div>';
                    $("#app").html(html);
                    return;
                }else{
                    //加载页面
                    $.ajax({
                        url: '../../../templates' + urlRewrite(url) + '.html',
                        cache: true,
                        async: true,
                        success: function (html) {
                            $("#app").html(html);
                        }
                    });
                }
            }
        }
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
        var paramIndex = getQueryString("index");
        if(paramIndex == "undefined" || paramIndex == "" || paramIndex == null){
            this.defaultActive = "-1";
        }else{
            this.defaultActive = getQueryString("index");
        }
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