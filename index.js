/**
 * Created by anthony on 06/07/2017.
 */
class ServerLocation {

    constructor(serialized) {
        this.serialized = serialized || {}
        this['Hello World?'] = 'hi'
    }

    getPropertValue(propertyName, defaultValue) {
        return this.serialized[propertyName] || defaultValue
    }

    get host() {
        return this.getPropertValue('host', 'localhost')
    }

    set implode(attrName){
        let value = this[attrName]
        return value
    }

    get hostname() {
        this.getPropertValue('host', 'localhost')
    }

    get href() {
        this.getPropertValue('host', 'localhost')
    }

    get origin() {
        this.getPropertValue('host', 'localhost')
    }

    get pathname() {
        this.getPropertValue('host', 'localhost')
    }

    get port() {
        return this.getPropertValue('port', '11616')
    }

    get protocol() {
        return this.getPropertValue('protocol', 'http:')
    }

    static get default() {
        return new this()
    }

    static get none() {
        return null
    }

    static array(...locations) {
        return locations
    }
}
const EventEmitter = Object//Emitter == 'undefined' ? Emitter : require('./examples/emitter')

class Whenable extends EventEmitter {

    constructor(potentials) {
        super()
        this.potentials = potentials || {}

    }

    when(...args) {
        //
        return super.on(...args)
    }

    whenLast(){

    }
}

//Whenable.potentiallyHighest()

class Controller extends Whenable {

    constructor(name, opts) {
        super()
        this._label = name
        this.superClassName = superClassName || null
        this._name = name
        this.tagName = (opts || {}).tagName || 'div'
        this.mixins = opts.mixins || []
    }

    get label() {
        return this._label
    }

    set mixins(newMixings) {
        this._mixins = newMixings
    }

    get mixins() {
        return this._mixins
    }

    static get BASE_SELECTOR_ACTION_MAP() {
        return {}
    }

    static get SELECTOR_ACTION_MAP() {
        return {}
    }

    render(elem) {
        for (let cls of this.mixins) {
            elem.classList.add(cls)
        }
        return elem
    }

    get elem() {
        return document.getElementById(this._name)
    }

}

class Application extends Controller {

    constructor(name, location) {
        super(name, {})
        this.location = location || Location.default
        this.defferreds = {}
        this.ID_MASTER = 1
        this.meta = {}
    }

    generateDeffered() {
        let newId = ++this.ID_MASTER
        let deffered = {uuid: newId}

        deffered.promise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })

        return deffered
    }

    modelFromElem(elem){

    }

    attachListeners(){
        for(let [sel, actionInfo] of _.toPairs(this.constructor.SELECTOR_ACTION_MAP)){
            if(_.isString(actionInfo)){
                actionInfo = {label:actionInfo}
            }

            $(sel).on(actionInfo.label, (event) => {
                let model = this.modelFromElem(event.target)

                
            })
        }
    }

    baseControllers() {
        return []
    }

    static get controllers() {
        return this.CONTROLLERS
    }

    get controllers() {
        return this.constructor.controllers
    }

    static get modelTypes() {
        return this.MODELS
    }

    get servers() {
        if (this._servers) return this._servers
        this._servers = [Application.root]
        return this._servers
    }

    get server() {
        return this.first
    }

    get first() {
        return Application.root
    }

    get last() {
        return _.nth(this.servers, -1)
    }

    showModal(modalId, submitBtnId, modelType) {

        const withElem = ($modal, submitId, mType) => {
            return new Promise((resolve, reject) => {

                $modal.modal({
                    keyboard: true
                })
                //let $submitBtn =
                $(`#${submitId}`).one('click', () => {
                    resolve(mType.fromElem($modal.get(0)))
                    $modal.modal('hide')
                })

                $modal.one('hidden.bs.modal', () => {
                    resolve(false)
                })
            })
        }

        if (_.isString(modalId) && _.isString(submitBtnId)) {
            if (!document.getElementById(modalId)) throw new Error('invalid modal element id')
            if (!document.getElementById(submitBtnId)) throw new Error('invalid submit element id')
            if (!_.isFunction(modelType)) throw new Error(`invalid modelType arguement: "${modelType}"`)

            let $modal = $(`#${modalId}`)
            return withElem($modal, submitBtnId, modelType)
        } else {
            modelType = submitBtnId
            console.assert(_.isFunction(modelType), 'modeltype must be cunstructor')
            let opts = modalId || {}
            opts.title = opts.title || 'Modal'
            opts.elemId = opts.elemId || 'modal-id'
            opts.body = opts.body || ''
            opts.contextualClass = opts.contextualClass || 'primary'
            opts.successBtnId = opts.successBtnId || 'modal-success'
            opts.laterBtnId = opts.laterBtnId || 'modal-later'
            opts.hideFooter = opts.hideFooter || false

            let template = this.modalTemplate || Application.MODAL_TEMPLATE

            let elem = $(this.modalElemContainer)
            elem.empty()
            elem.append($(`${_.template(template)(opts)}`))

            return withElem(elem, opts.successBtnId, modelType)
        }
    }

    get modalElemContainer() {
        return $('div[role="dialog"]').first().get(0)
    }

    addController(controller) {
        this.controllers[controller.label] = controller
    }

    renderToDocument(doc) {
        let mains = document.body.getElementsByTagName('main')
        if (_.isEmpty(mains)) {
            throw new Error('could not locate "<main></main>" in body')
        }

        let main = $(mains[0])
        main.empty()

        for (let controller of this.baseControllers()) {
            let elem = $(`<${controller.tagName} id="${controller.label}" class=""></${controller.tagName}>`)
            main.append(elem)
            controller.render(elem.get(0))
        }

    }

}


const TEMPLATE_EDIT_APP_MODEL = `
    <form class="form-horizontal">
        <% _.forEach(attrMapByPriority, function(attrInfo){ %>
            <% var infoId = group+'_'+app+'_'+attrInfo.label+'_'+attrInfo.type%>
            <% if(attrInfo.type === 'string') { %>
                <div class="form-group">
                <label for="<%= infoId %>" class="col-sm-2 control-label"><%= attrInfo.description %></label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="<%= infoId %>" data-key="<%= infoId %>" value="<%= attrInfo.value %>" placeholder="<%= attrInfo.placeholder %>">
                    </div>
                </div>
            <% } %>
            <% if(attrInfo.type === 'text') { %>
                <div class="form-group">
                <label for="<%= infoId %>" class="col-sm-2 control-label"><%= attrInfo.description %></label>
                    <div class="col-sm-10">
                        <textarea class="form-control col-sm-10" id="<%= infoId %>" data-key="<%= infoId %>" placeholder="<%= attrInfo.placeholder %>" rows="3"><%= attrInfo.value %></textarea>
                    </div>
                </div>
            <% } %>
            <% if(attrInfo.type === 'img') { %>
            <div class="form-group">
                <label for="<%= infoId %>" class="col-sm-2 control-label"><%= attrInfo.description %></label>
                
                <div class="col-sm-10">
                    <div class="input-group">
                        <input type="text" class="form-control" aria-label="..." id="<%= infoId %>">
                        <div class="input-group-btn">
                            <button class="btn btn-default" type="button">
                                <img height="" src="<%= images.icon.paste %>">
                            </button>
                            <button class="btn btn-default" type="button">Browse</button>
                        </div>
                    </div>
                </div>
            </div>
            <% } %>
        <% }); %>
    </form>`

class Model extends Controller {

    constructor(serialized) {
        super(serialized)
        this.serialized = serialized || {}
    }

    static get BASE_ATTR_TYPE_MAP() {
        return {
            name: 'string',
            title: 'string',
            label: 'string',
            description: 'text',
            fullDescription: 'text'
        }
    }

    static get ATTR_TYPE_MAP() {
        return {}
    }

    editorElemHtml(opts) {
        opts = opts || {}
        let attrMap = opts.attrMap = {}
        for (let [attrName, attrType] of _.toPairs(this.constructor.ATTR_TYPE_MAP)) {
            let attrInfo = !_.isObject(attrType) ? {type: attrType, order: -1} : attrType

            if (!_.isObject(attrType)) {
                attrInfo.label = attrInfo.description = attrName
                attrInfo.type = attrType
                attrInfo.demoValue = ""
                attrInfo.placeholder = attrName
            }
            attrInfo.value = this[attrName]
            attrMap[attrName] = attrInfo
        }
        opts.app = this.name
        opts.group = this.group
        opts.attrMapByPriority = _.sortBy(opts.attrMap, (m) => m.order)
        return _.template(TEMPLATE_EDIT_APP_MODEL)(opts)
    }

    toDataAttrs() {
        let res = {}
        for (let attr of _.keys(this.constructor.ATTR_TYPE_MAP)) {
            let value = this[attr]
            if (_.isUndefined(value)) continue
            res[attr] = `data-${attr.toLowerCase()}="${value}"`
        }
        return res
    }

    get elem() {
        return this.serialized['_elem']
    }

    get name() {
        return this.serialized.name
    }

    get title() {
        return this.serialized.title || this.name
    }

    get label() {
        return this.serialized.label || this.name
    }

    get description() {
        return this.serialized.description || this.constructor.name
    }

    get fullDescription() {
        return this.serialized.fullDescription || this.description
    }

    editorElem(attributeNames, attributeTypes) {

    }

    static fromElem(elem, attributeNames) {
        let serialized = {_elem: elem}
        if (_.isArray(attributeNames)) {
            serialized = _.merge(this.fromElem(elem, attributeNames).serialized, serialized)
        } else {
            for (let [attr, attrType] of _.toPairs(this.ATTR_TYPE_MAP)) {
                attrType = _.isString(attrType) ? attrType : attrType.type
                let $el = $(`[data-key$=${attr}_${attrType}`).get(0)
                if (!$el) continue
                serialized[attr] = $el.value
            }
        }
        return new this(serialized)
    }
}

Application.MODELS = {}

Application.CONTROLLERS = {}

Application.MODAL_TEMPLATE = `
<div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title text-center" id="modal_title"><%= title %></h4>
                </div>
                <div class="modal-body">
                    <%= body %>
                </div>
                
                <% if(!hideFooter){ %>
                    <div class="modal-footer">
                
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="<%- successBtnId %>" data-modal-id="<%= elemId %>">Submit</button>
                    </div>
                <% } %>
            </div>
        </div>
`

class Server extends Whenable {

    constructor(location) {
        super()
        this.location = location
        this._socket = null
    }

    get connected() {
        return this._socket === null
    }

    connect() {
        if (this.connected) return Promise.resolve(this)
        return new Promise((resolve, reject) => {
            resolve(this)
        })
    }

}

Application.root = new Server(ServerLocation.default)

if(module === require.main){
    let sl = ServerLocation.default
    console.log(sl)
    sl.implode = 'interesting'
    let my = 'yes'
    let res = my &&  (sl.implode = 'Hello World?') || 'no'
    console.log('result:', my)

    //const time_in_utc = job.my_edt_date = 'UTC'


}