// Bootstrap file to ensure reflect-metadata is loaded before anything else
import 'reflect-metadata'

// Force global polyfill for reflection
if (typeof Reflect === 'undefined' || typeof Reflect.getMetadata !== 'function') {
  require('reflect-metadata')
}

export {}
