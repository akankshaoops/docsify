import { documentReady } from './util/dom.js';
import { Docsify } from './Docsify.js';
import initGlobalAPI from './global-api.js';
import './render/rightTOC.js'; // Import new script

// TODO This global API and auto-running Docsify will be deprecated, and removed
// in a major release. Instead we'll tell users to use `new Docsify()` to create
// and manage their instance(s).

/**
 * Global API
 */
initGlobalAPI();

/**
 * Run Docsify
 */
documentReady(() => new Docsify());
