/**
 * Created by anthony on 12/07/2017.
 */

const INDETERMINATE = null

class PagerView extends Controller {

    constructor(name, opts){
        super(name, opts)
    }

    get currentSlide(){
        return
    }

}

class Slides extends Application {

    constructor(name, location){
        super(name, location)
        this.pagerView = new PagerView()

        this.presentationStartedTime = INDETERMINATE
    }

    static get BASE_SELECTOR_AND_MAP() {
        return {}
    }

}

const presentation = new Slides('main')
presentation.renderToDocument(document)

$(() => {
    presentation.attachListeners()
    _.templateSettings.imports.app = presentation
    _.templateSettings.imports.images = images
})