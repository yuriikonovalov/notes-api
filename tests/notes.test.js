"use strict";
let init = require("./steps/init")
const {beforeAll, describe, expect, it, test} = require("@jest/globals");
let {an_authenticated_user} = require("./steps/given")
let {we_invoke_createNote, we_invoke_updateNote} = require("./steps/when")
let idToken;

test('Given an authenticated user', async () => {
    init();
    let user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
    console.log(idToken)
});

describe('When we invoke POST /notes endpoint', () => {
    it('Should create a new note', async () => {
        const body = {
            id: "1000",
            title: "My test note",
            body: "Hello, this is the note body"
        }
        let result = await we_invoke_createNote({idToken, body});
        expect(result.statusCode).toEqual(201);
        expect(result.body).not.toBeNull();
    });
});

describe('When we invoke PUT /notes/:id endpoint', () => {
    it('Should update the note', async () => {
        const noteId = "1000";
        const body = {
            title: "My updated test note",
            body: "Hello, this is the updated note body"
        }
        let result = await we_invoke_updateNote({idToken, body, noteId});
        expect(result.statusCode).toEqual(200);
        expect(result.body).not.toBeNull();
    });
});
