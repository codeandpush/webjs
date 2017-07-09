/**
 * Created by anthony on 06/07/2017.
 */
class ServerLocation {
    
    constructor(serialized) {
        this.serialized = serialized || {}
        this._type = ServerLocation
    }
    
    getPropertValue(propertyName, defaultValue) {
        return this.serialized[propertyName] || defaultValue
    }
    
    get host() {
        /**
         * "www.bbc.co.uk"
         */
        return this.getPropertValue('host', 'localhost')
    }
    
    get hostname() {
        /***
         * "www.bbc.co.uk"
         */
        this.getPropertValue('host', 'localhost')
    }
    
    
    get href() {
        /***
         * "http://www.bbc.co.uk/news/education-40504754"
         */
        this.getPropertValue('host', 'localhost')
    }
    
    get origin() {
        /***
         * "http://www.bbc.co.uk"
         */
        this.getPropertValue('host', 'localhost')
    }
    
    get pathname() {
        /***
         * "/news/education-40504754"
         */
        this.getPropertValue('host', 'localhost')
    }
    
    get port() {
        return this.getPropertValue('port', '11616')
    }
    
    get protocol() {
        /***
         * "http:"
         */
        return this.getPropertValue('protocol', 'http:')
    }
    
    get reload() {
    
    }
    
    
    get search() {
    
    }
    
    static get default() {
        return new this.type
    }
    
    static get none() {
        return null
    }
    
    static array(...locations) {
        return locations
    }
    
    static set type(otherType) {
        this._type = otherType || ServerLocation
    }
    
    static get type() {
        return this._type
    }
}

const EventEmitter = Emitter

class Renderable {
    
    constructor(name, superClassName) {
        this._label = name
        this.superClassName = superClassName || null
    }
    
    get label() {
        return this._label
    }
    
    get model() {
        return {}
    }
    
    set mixins(newMixings) {
        this._mixins = newMixings
    }
    
    get mixins() {
        return this._mixins
    }
    
    render(elem) {
        for (let cls of this.mixins) {
            elem.classList.add(cls)
        }
        return elem
    }
}

class Application extends EventEmitter {
    
    constructor(location) {
        super()
        this.location = location || Location.default
        this.defferreds = {}
        this.ID_MASTER = 1
        this.meta = {}
    }
    
    when(...args) {
        return super.on(...args)
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
    
    get serialized() {
        return {}
    }
    
    baseControllers() {
        return []
    }
    
    static get controllers() {
        return this.CONTROLLERS
    }
    
    get controllers() {
        return this.constructor.CONTROLLERS
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
        }else{
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
    
    get modalElemContainer(){
        return $('div[role="dialog"]').first().get(0)
    }

addController(controller)
{
    this.controllers[controller.label] = controller
}

renderToDocument(doc)
{
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

class Controller extends Renderable {
    
    constructor(name, opts) {
        super(name, opts.mixins)
        this._name = name
        this.tagName = (opts || {}).tagName || 'div'
        this.mixins = opts.mixins || []
    }
    
    get elem() {
        return document.getElementById(this._name)
    }
    
}

class Model {
    
    constructor(serialized) {
        this.serialized = serialized || {}
    }
    
    static get BASE_ATTR_TYPE_MAP() {
        return {name: 'string',
                title: 'string',
                label: 'string',
                description: 'text',
                fullDescription: 'text'
                }
    }
    
    static get ATTR_TYPE_MAP() {
        return {}
    }
    
    editorElemHtml(){
        return ''
    }
    
    toDataAttrs(){
        let res = {}
        for(let attr of _.keys(this.constructor.ATTR_TYPE_MAP)){
            let value = this[attr]
            if(_.isUndefined(value)) continue
            res[attr] = `data-${attr.toLowerCase()}="${value}"`
        }
        return res
    }
    
    get elem() {
        return this.serialized['_elem']
    }
    
    get name(){
        return this.serialized.name
    }
    
    get title(){
        return this.serialized.title || this.name
    }
    
    get label(){
        return this.serialized.label || this.name
    }
    
    get description(){
        return this.serialized.description || this.constructor.name
    }
    
    get fullDescription(){
        return this.serialized.fullDescription || this.description
    }
    
    editorElem(attributeNames, attributeTypes){
    
    }
    
    static fromElem(elem, attributeNames) {
        let serialized = {_elem: elem}
        attributeNames = attributeNames || []
        for (let attr of attributeNames) {
            let dataKey = `data-${attr}`
            let dataValue = elem.attributes[dataKey] || null
            if (dataValue !== null) {
                serialized[attr] = dataValue.nodeValue
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

class Server extends EventEmitter {
    
    constructor(location) {
        super()
        this.location = location
        this._socket = null
    }
    
    when(...args) {
        return super.on(...args)
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

Application.root = new Server(Location.default)