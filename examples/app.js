/**
 * Created by anthony on 08/07/2017.
 */
console.log('starting app...')


class DemoModel extends Model {
    
    static get attributeNames() {
        return ['category', 'label', 'url', 'group']
    }
    
    get url(){
        return this.serialized.url
    }
    
    get group(){
        return this.serialized.group
    }
    
    get category(){
        return this.serialized.category
    }
}

const APP_LIST_TEMPLATE = `
            <div class="page-header">
  <h1>Demo <small>concepts</small></h1>
</div>
<ul class="nav nav-pills">
    <% let groupPairs = _.sortBy(_.toPairs(groups), ([label, g]) => label) %>
    <% console.log(groupPairs) %>

    <% if(_.first(groupPairs)){ %>
        <li role="presentation" class="active"><a data-toggle="pill" data-category="group" data-label="<%= _.first(groupPairs)[0] %>" href="#<%= _.first(groupPairs)[0] %>"><%= _.first(groupPairs)[1].label %></a></li>
    <% } %>
    
   <% _.forEach(_.tail(groupPairs), function(group){ %>
        <li role="presentation" ><a data-toggle="pill" data-category="group" href="#<%= group[0] %>"><%= group[1].label %></a></li>
   <% }); %>
</ul>

<div class="tab-content" style="margin-top: 16px">
    <% _.forEach(groupPairs, function(item){ %>
        <% var group = item[1], key = item[0]; %>
        <div class="tab-pane fade in active" id="<%= key %>">
            <ul class="media-list">
            <% _.forEach(group.apps, function(app){ %>
              <!--<a href="#" class="list-group-item" data-category="app" data-label="<%= app.label %>" data-url="<%= app.url %>">-->
                <!--<h4 class="list-group-item-heading"><%= app.title %></h4>-->
                <!--<p class="list-group-item-text"><%= app.description %></p>-->
              <!--</a>-->
              
              
            <li class="media">
              
              <div class="media-left media-middle">
                <a href="#" data-category="app" data-label="<%= app.label %>" data-url="<%= app.url %>" data-group="<%= key %>">
                  <img width="64px" height="64px" class="media-object" src="<%= app.thumbnail || '../examples/no_app.png' %>" alt="app image">
                </a>
              </div>
              <div class="media-body">
                <h4 class="media-heading"><a href="#" data-category="app" data-label="<%= app.label %>" data-url="<%= app.url %>" data-group="<%= key %>"><%= app.title %></a></h4>
                <p><%= app.description %></p>
              </div>
            </li>
            
              
            <% }); %>
            </ul>
        </div>
        
        
    <% }); %>
    
</div>`

class DemoPicker extends Controller {
    
    constructor(name, opts) {
        super(name, opts)
        this._currentAd = null
    
        let catApps = [
            {
                title: 'CatZillar 5000', html: '<h6>CATS RULE</h6>',
                label: 'catzillar', description: 'all cat info in one place',
                url: 'http://edey.ng',
                thumbnail: null,
            },
            {
                title: 'Kitty Land', html: '<h6>Kitty RULE</h6>',
                label: 'kitty_land', description: 'cat lips catalogue',
                url: 'https://en.wikipedia.org/wiki/Main_Page',
                thumbnail: null,
            },
        ]
    
        this.groups = {
            'dogs': {label: 'Dogs', apps: [], url: ''},
            'cats': {label: 'Cats', apps: catApps, url: ''},
        }
    }
    
    get ads(){
        return []
    }
    
    set currentAd(ad){
    
    }
    
    get currentAd(){
        return this._currentAd
    }
    
    get adElem() {
        return $(this.elem).find('.advert').get(0)
    }
    
    render(elem) {
        super.render(elem)
        console.dir(elem.parent)
        $(elem).parent().get(0).style.height = '100%'
        
        elem.style.height = '100%'
        elem.style.position = 'relative'
        //elem.style.display = 'inline-block'
        //elem.style.marginLeft = '16px'
        elem.style.backgroundColor = 'white'
    
        
    
        let $elem = $(elem)
        $elem.append($(_.template(APP_LIST_TEMPLATE)({groups: this.groups})))
    
        $elem.append($(`<nav aria-label="...">
  <ul class="pager">
    <li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Older</a></li>
    <li class="next"><a href="#">Newer <span aria-hidden="true">&rarr;</span></a></li>
  </ul>
</nav>`))
        
        $elem.append($(`<div class="advert" data-category="ad" style="background-color: aquamarine;height: 20%;width:92%;position: absolute;bottom: 30px;">

</div>`))
    
        $elem.append($(`
<div class="row" style="padding: 16px; position: absolute;bottom: 16px;width: 100%;">
  <button type="button" id="add_ad_btn" class="col-sx-6 btn btn-warning">Post Ad</button>
  <button type="button" id="add_app_btn" class="col-sx-6 btn btn-primary pull-right">Add Application</button>
</div>
`))
        
        return elem
    }
}

class DemoView extends Controller {
    
    set src(url) {
        this.iframe.src = url
    }
    
    
    get iframe(){
        return $(this.elem).find('iframe').get(0)
    }
    
    render(elem) {
        super.render(elem)
        
        let iframe = $(`<iframe src="https://spin.atomicobject.com/2015/12/23/swift-uipageviewcontroller-tutorial/"></iframe>`).get(0)
    
        iframe.height = '100%'
        iframe.width = '100%'
        iframe.frameBorder = 0
        iframe.style.margin = 0
        iframe.style.padding = 0
        iframe.style.height = '100%'
        iframe.style.width = '100%'
        
        elem.style.margin = 0
        elem.style.height = '100%'
        //elem.style.width = '100%'
        elem.style.padding = 0
        elem.style.backgroundColor = 'darkgray'
        elem.style.position = 'relative'
        
        $(elem).append(iframe)
        return elem
        
    }
    
    
}

class DemoApp extends Application {
    
    constructor(location) {
        super(location)
        let models = this.constructor.modelTypes
        this.demoPicker = new DemoPicker('demo_picker', {mixins:['col-md-3', 'border-right'], tagName:'aside'})
        this.demoView = new DemoView('demo_view', {mixins:['col-md-9', 'embed-responsive'], tagName:'div'})
        
        this.addController(this.demoPicker)
        this.addController(this.demoView)
        
        models['default'] = DemoModel
        models['group'] = DemoModel
        models['app'] = DemoModel
        models['ad'] = DemoModel
    }
    
    baseElemTypeNames() {
        return ['demo_picker', 'demo_view']
    }
    
    attachAccessors() {
        $('a[data-category]').on('click', (event) => {
            let a = $(event.target).closest('a').get(0)
            let modelType = Application.modelTypes[a.attributes['data-category'].nodeValue]
            let model = modelType.fromElem(a, modelType.attributeNames)
            $('a[data-category]').removeClass('active')
            a.classList.add('active')
            this.emit('click', model)
        })
        
        $(app.controllers['demo_picker'].adElem).on('click', (event) => {
            let ad = event.target
            let modelType = Application.modelTypes[ad.attributes['data-category'].nodeValue]
            this.emit('ad_click', modelType.fromElem(ad, modelType.attributeNames))
        })
        
        $('#add_app_btn').on('click', (event) => {
            this.emit('add_app_click')
        })
    
        $('#add_ad_btn').on('click', (event) => {
            this.emit('add_ad_click')
        })
        
        $('#app_modal_submit').on('click', (event) => {
            this.emit('app_add')
        })
    }
}

app = new DemoApp()
app.renderToDocument(document)

app.when('ad_click', () => {
    let demoPicker = app.controllers['demo_picker']
    console.log('model:', demoPicker.currentAd)
})

app.when('app_add', (newApp) => {
    console.log('app_add', newApp)
    $('#myModal').modal('hide')
})

app.when('add_app_click', () => {
    console.log('add application')
    $('#myModal').modal('show')
})

app.when('add_ad_click', () => {
    console.log('post advert')
})

app.when('click', (model) => {
    let demoView = app.controllers['demo_view']
    
    
    if(!(model.category === 'app' && _.isString(model.url))) return
    
    demoView.src = model.url
    
    demoView.iframe.onload = () => {
        let imgElem = $(model.elem).closest('.media').find('.media-left img').get(0)
        if(imgElem.src === '../examples/no_app.png') return
    
        console.log('getting screenshot...')
        html2canvas(demoView.elem, {
            onrendered: function (canvas) {
                imgElem.src = canvas.toDataURL()
            },
            width: 64,
            height: 64
        });
    }
})

$(() => app.attachAccessors())


