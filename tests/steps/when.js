"use strict";
const _ = require("lodash")
const Promise = this.Promise || require('promise');
const agent = require('superagent-promise')(require('superagent'), Promise);
const makeHttpRequest = async (path, method, options) => {
    let root = process.env.TEST_ROOT;
    let url = options.noteId ? `${root}/${path}/${options.noteId}` : `${root}/${path}`;
    let httpReq = agent(method, url);
    let body = _.get(options, "body");
    let idToken = _.get(options, "idToken");
    console.log(`invoking HTTP ${method} ${url}`)

    try {
        // Set Authorization header
        httpReq.set("Authorization", idToken)
        if (body) {
            httpReq.send(body);
        }
        let response = await httpReq;
        return {
            statusCode: response.status, body: response.body
        }
    } catch (error) {
        return {
            statusCode: error.statusCode, body: null
        }
    }
};

exports.we_invoke_createNote = (options) => {
    return makeHttpRequest("notes", "POST", options);
}


exports.we_invoke_updateNote = (options) => {
    return makeHttpRequest("notes", "PUT", options)
}