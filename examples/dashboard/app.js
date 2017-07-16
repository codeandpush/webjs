/**
 * Created by anthony on 08/07/2017.
 */
console.log('starting app...')

class DemoModel extends Model {
    
    static get ATTR_TYPE_MAP() {
        let atts = {
            category: {
                type: 'string',
                demoValue: 'Cats',
                label: 'Category',
                description: 'Category',
                placeholder: 'Category of App'
            },
            label: 'string',
            url: 'string',
            group: 'string'
        }
        return _.merge(atts, Model.BASE_ATTR_TYPE_MAP)
    }
    
    get url() {
        return this.serialized.url
    }
    
    get group() {
        return this.serialized.group || this.serialized.groupLabel
    }
    
    get category() {
        return this.serialized.category
    }
}


class DemoAppModel extends DemoModel {
    
    static get ATTR_TYPE_MAP() {
        let atts = {category: 'string', label: 'string', url: 'string', group: 'string', 'thumbnail': 'img'}
        return _.merge(atts, DemoModel.ATTR_TYPE_MAP)
    }
    
    get category() {
        return 'app'
    }
    
    get thumbnail() {
        return this.serialized.thumbnail
    }
}

const APP_LIST_TEMPLATE = `
<div class="page-header">
  <h1>Demo <small>web apps</small></h1>
</div>
<ul class="nav nav-pills">
    <% let groupPairs = _.sortBy(_.toPairs(groups), ([label, g]) => label) %>

   <% _.forEach(groupPairs, function(group){ %>
        <li role="presentation" ><a data-toggle="pill" data-category="group" href="#<%= group[0] %>"><%= group[1].title %></a></li>
   <% }); %>
</ul>

<div class="tab-content" style="margin-top: 16px">
    <% _.forEach(groupPairs, function(item){ %>
        <% var group = item[1], key = item[0]; %>
        <div class="tab-pane fade in active" id="<%= key %>">
            <ul class="media-list">
            <% _.forEach(group.apps, function(app){ %>
              
                <li class="media" <%= _.values(app.toDataAttrs()).join(' ') %> >
                  <div class="media-left media-middle">
                    <a href="#" data-category="app" data-title="<%= app.title %>" data-description="<%= app.description %>" data-label="<%= app.label %>" data-url="<%= app.url %>" data-group="<%= key %>">
                      <img width="64px" height="64px" class="media-object" src="<%= app.thumbnail || '../examples/no_app.png' %>" alt="app image">
                    </a>
                  </div>
                  <div class="media-body">
                    <h4 class="media-heading"><a href="#" data-category="app" data-label="<%= app.label %>" data-url="<%= app.url %>" data-title="<%= app.title %>" data-description="<%= app.description %>" data-group="<%= key %>"><%= app.title %></a></h4>
                    <p><%= app.description %></p>
                    <div class="btn-group btn-group-xs pull-right" role="group" aria-label="...">
                      <button type="button" class="btn btn-primary" data-category="action" data-emit="edit_app">Edit</button>
                      <button type="button" class="btn btn-default" data-category="action" data-emit="share_app">Share</button>
                    </div>
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
        this._apps = [
            new DemoAppModel({
                groupLabel: 'Cats',
                title: 'CatZillar 5000', html: '<h6>CATS RULE</h6>',
                label: 'catzillar', description: 'all cat info in one place',
                url: 'http://edey.ng',
                thumbnail: '/examples/dashboard/app_icon2.ico',
            }),
            new DemoAppModel({
                groupLabel: 'Cats',
                title: 'Kitty Land', html: '<h6>Kitty RULE</h6>',
                label: 'kitty_land', description: 'cat lips catalogue',
                url: 'https://en.wikipedia.org/wiki/Main_Page',
                thumbnail: '/examples/dashboard/app_icon1.ico',
            }),
            new DemoAppModel({
                groupLabel: 'Dogs',
                title: 'Dog World', html: '<h6>Dogs RULE</h6>',
                label: 'dog_world', description: 'Different breeds of dog',
                url: 'https://en.wikipedia.org/wiki/Dog',
                thumbnail: '/examples/dashboard/app_icon1.ico',
            }),
        ]
    }
    
    get apps() {
        return this._apps
    }
    
    get groups() {
        this._groups = {}
        for (let [gn, data] of _.toPairs(_.groupBy(this.apps, (a) => a.group.toLowerCase()))) {
            this._groups[gn] = {apps: data, label: gn, title: data[0].group}
        }
        return this._groups
    }
    
    getTabElem(groupLabel) {
        return document.getElementById(groupLabel.toLowerCase())
    }
    
    render(elem) {
        super.render(elem)
        let $elem = $(elem)
        
        $elem.parent().get(0).style.height = '100%'
        
        elem.style.height = '100%'
        elem.style.position = 'relative'
        elem.style.backgroundColor = 'white'
        
        $elem.append($(_.template(APP_LIST_TEMPLATE)({groups: this.groups})))
        
        $elem.append($(`<nav aria-label="...">
      <ul class="pager">
        <li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Older</a></li>
        <li class="next disabled"><a href="#">Newer <span aria-hidden="true">&rarr;</span></a></li>
      </ul>
    </nav>`))
        
        
        $elem.append($(`
        <div class="row" style="padding: 16px; position: absolute;bottom: 16px;width: 100%;">
          <button type="button" id="add_app_btn" class="col-sx-12 btn btn-primary text-center" style="width: 100%">Add Application</button>
        </div>
        `))
        
        $elem.ready(() => {
            this.getTabElem(this.apps[0].group).classList.add('active')
        })
        return elem
    }
}

class DemoView extends Controller {
    
    set src(url) {
        this.iframe.src = url
    }
    
    
    get iframe() {
        return $(this.elem).find('iframe').get(0)
    }
    
    render(elem) {
        super.render(elem)
        
        let iframe = $(`<iframe></iframe>`).get(0)
        
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
        this.demoPicker = new DemoPicker('demo_picker', {mixins: ['col-md-3', 'border-right'], tagName: 'aside'})
        this.demoView = new DemoView('demo_view', {mixins: ['col-md-9', 'embed-responsive'], tagName: 'div'})
        
        this.addController(this.demoPicker)
        this.addController(this.demoView)
        
        models['default'] = DemoModel
        models['group'] = DemoModel
        models['app'] = DemoModel
    }
    
    baseControllers() {
        return [this.demoPicker, this.demoView]
    }
    
    detachListeners() {
        console.log('detaching listeners...')
        $('a[data-category]').off('click')
        $('#add_app_btn').off('click')
    }
    
    attachListeners() {
        console.log('attaching listeners...')
        $('a[data-category]').on('click', (event) => {
            let a = $(event.target).closest('a').get(0)
            let modelType = Application.modelTypes[a.attributes['data-category'].nodeValue]
            let model = modelType.fromElem(a, _.keys(modelType.ATTR_TYPE_MAP))
            $('a[data-category]').removeClass('active')
            a.classList.add('active')
            this.emit('click', model)
        })
        
        $('#add_app_btn').on('click', (event) => {
            this.emit('add_app_btn_click')
        })
        
        $('button[data-category="action"]').on('click', (event) => {
            let appModel = DemoAppModel.fromElem($(event.target).closest('[data-category="app"]').get(0), _.keys(DemoAppModel.ATTR_TYPE_MAP))
            this.emit(event.target.attributes['data-emit'].nodeValue, appModel)
        })
    }
    
    showNewAppModal() {
        return this.showModal({
            title: 'New Application',
            body: _.template(this.constructor.TEMPLATE_MODAL_BODY)(),
        }, DemoAppModel)
    }
    
    addNewDemoApp(newApp) {
        console.log('adding new app:', newApp)
        this.demoPicker.apps.push(newApp)
        
        this.detachListeners()
        $(this.demoPicker.elem).empty()
        this.demoPicker.render(this.demoPicker.elem)
        
        this.attachListeners()
    }
}

app = new DemoApp()

app.server.connect()
    .then((server) => {
        console.log('server connected:', server)
        server.when('created_demo_app', (newApp) => {
            console.log('got new app from server:', newApp)
            app.addNewDemoApp(newApp)
        })
    })

app.when('add_app_btn_click', () => {
    console.log('add application')
    app.showNewAppModal()
        .then((newApp) => {
            if (!_.isObject(newApp)) return
            app.addNewDemoApp(newApp)
        })
})

app.when('share_app', (theApp) => {
    app.showModal({
        title: `Share: ${theApp && theApp.title || 'App' }`,
        body: `<h3><a href="${theApp.url}" target="_blank" id="share_app_click" class="text-center" style="width: 100%">${theApp.url}</a></h3>`,
        successBtnId: 'share_app_click',
        hideFooter: true
    }, DemoAppModel)
        .then(() => {
            console.log('share done')
        })
})

app.when('edit_app', (theApp) => {
    app.showModal({
        title: `Edit: ${theApp && theApp.title || 'App' }`,
        body: theApp.editorElemHtml(),
        contextualClass: 'info',
    }, DemoAppModel)
        .then((newApp) => {
            if (!_.isObject(newApp)) return
            
            
            let dApp = _.find(app.demoPicker.apps, {url: newApp.url})
            if (_.isObject(dApp)) {
                dApp.serialized = newApp.serialized
                app.detachListeners()
                $(app.demoPicker.elem).empty()
                app.demoPicker.render(app.demoPicker.elem)
                app.attachListeners()
            }
        })
})

app.when('click', (model) => {
    let demoView = app.controllers['demo_view']
    if (model.category === 'app' && _.isString(model.url)) {
        demoView.src = model.url
    }
})

app.renderToDocument(document)

$(() => {
    app.attachListeners()
    _.templateSettings.imports.app = app
    _.templateSettings.imports.images = images
})

DemoApp.TEMPLATE_MODAL_BODY = `<form class="form-horizontal">
                        <div class="form-group">
                            <label for="_group_string" class="col-sm-2 control-label">Group</label>
                            <div class="col-sm-10">
                                <select class="form-control" id="_group_string" data-key="_group_string">
                                    <% _.forEach(app.demoPicker.groups, function(group){ %>
                                    <option><%= group.title %></option>
                                    <% }); %>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="_name_string" class="col-sm-2 control-label">App name</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="_name_string" data-key="_name_string" value="Sample App" placeholder="My App">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="_url_string" class="col-sm-2 control-label">Homepage</label>
                            <div class="col-sm-10">
                                <input type="url" class="form-control" id="_url_string" data-key="_url_string" value="http://example.com" placeholder="http://myapp.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="_thumbnail_string" class="col-sm-2 control-label">Thumbnail</label>
                            <div class="col-sm-10">
                                <input type="url" class="form-control" id="_thumbnail_string" data-key="_thumbnail_string" placeholder="http://myapp.com/screenshot.png">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="_description_string" class="col-sm-2 control-label">Description</label>
                            <div class="col-sm-10">
                                <textarea class="form-control col-sm-10" id="_description_string" data-key="_description_string" rows="3">Sample app</textarea>
                            </div>
                        </div>
                    </form>`

