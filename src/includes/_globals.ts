import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export default { 
  install(app) {
    // will return an object of imported files with .vue extension
    const baseComponents = import.meta.glob('../components/base/*.vue', {
      eager: true, // load the modules immeadiately
    })

    Object.entries(baseComponents).forEach(([path, module]) => {
      // format the name of the component in PascalCase using lodash
      const componentName = upperFirst(
        camelCase(
          path
            .split('/')
            .pop()
            .replace(/\.\w+$/, "") // replace .vue inside the string to '' (removing from it)
        )
      )
      // prefixing and registering the component
      app.component(`Base${componentName}`, module.default)
    })
  }
}

// This file will automatically register components defined in the /components/base directory