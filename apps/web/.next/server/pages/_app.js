/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/lib/SessionContext.tsx":
/*!************************************!*\
  !*** ./src/lib/SessionContext.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SessionProvider: () => (/* binding */ SessionProvider),\n/* harmony export */   useSession: () => (/* binding */ useSession)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabaseClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./supabaseClient */ \"./src/lib/supabaseClient.ts\");\n\n\n\nconst SessionContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    session: null\n});\nconst SessionProvider = ({ children })=>{\n    const [session, setSession] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        _supabaseClient__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession().then(({ data: { session } })=>{\n            setSession(session);\n        });\n        const { data: { subscription } } = _supabaseClient__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.onAuthStateChange((_event, session)=>{\n            setSession(session);\n        });\n        return ()=>subscription.unsubscribe();\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SessionContext.Provider, {\n        value: {\n            session\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/anarculture/code/anarculture/dale.2/apps/web/src/lib/SessionContext.tsx\",\n        lineNumber: 23,\n        columnNumber: 5\n    }, undefined);\n};\nconst useSession = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(SessionContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL1Nlc3Npb25Db250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUF1RTtBQUMzQjtBQUc1QyxNQUFNSywrQkFBaUJMLG9EQUFhQSxDQUE4QjtJQUFFTSxTQUFTO0FBQUs7QUFFM0UsTUFBTUMsa0JBQWtCLENBQUMsRUFBRUMsUUFBUSxFQUFpQztJQUN6RSxNQUFNLENBQUNGLFNBQVNHLFdBQVcsR0FBR04sK0NBQVFBLENBQWlCO0lBRXZERCxnREFBU0EsQ0FBQztRQUNSRSxxREFBUUEsQ0FBQ00sSUFBSSxDQUFDQyxVQUFVLEdBQUdDLElBQUksQ0FBQyxDQUFDLEVBQUVDLE1BQU0sRUFBRVAsT0FBTyxFQUFFLEVBQUU7WUFDcERHLFdBQVdIO1FBQ2I7UUFFQSxNQUFNLEVBQUVPLE1BQU0sRUFBRUMsWUFBWSxFQUFFLEVBQUUsR0FBR1YscURBQVFBLENBQUNNLElBQUksQ0FBQ0ssaUJBQWlCLENBQUMsQ0FBQ0MsUUFBUVY7WUFDMUVHLFdBQVdIO1FBQ2I7UUFFQSxPQUFPLElBQU1RLGFBQWFHLFdBQVc7SUFDdkMsR0FBRyxFQUFFO0lBRUwscUJBQ0UsOERBQUNaLGVBQWVhLFFBQVE7UUFBQ0MsT0FBTztZQUFFYjtRQUFRO2tCQUN2Q0U7Ozs7OztBQUdQLEVBQUU7QUFFSyxNQUFNWSxhQUFhLElBQU1uQixpREFBVUEsQ0FBQ0ksZ0JBQWdCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGRhbGUvd2ViLy4vc3JjL2xpYi9TZXNzaW9uQ29udGV4dC50c3g/NWQ0YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICcuL3N1cGFiYXNlQ2xpZW50JztcbmltcG9ydCB0eXBlIHsgU2Vzc2lvbiB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XG5cbmNvbnN0IFNlc3Npb25Db250ZXh0ID0gY3JlYXRlQ29udGV4dDx7IHNlc3Npb246IFNlc3Npb24gfCBudWxsIH0+KHsgc2Vzc2lvbjogbnVsbCB9KTtcblxuZXhwb3J0IGNvbnN0IFNlc3Npb25Qcm92aWRlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiB7XG4gIGNvbnN0IFtzZXNzaW9uLCBzZXRTZXNzaW9uXSA9IHVzZVN0YXRlPFNlc3Npb24gfCBudWxsPihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHN1cGFiYXNlLmF1dGguZ2V0U2Vzc2lvbigpLnRoZW4oKHsgZGF0YTogeyBzZXNzaW9uIH0gfSkgPT4ge1xuICAgICAgc2V0U2Vzc2lvbihzZXNzaW9uKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgZGF0YTogeyBzdWJzY3JpcHRpb24gfSB9ID0gc3VwYWJhc2UuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZSgoX2V2ZW50LCBzZXNzaW9uKSA9PiB7XG4gICAgICBzZXRTZXNzaW9uKHNlc3Npb24pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U2Vzc2lvbkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgc2Vzc2lvbiB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1Nlc3Npb25Db250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZVNlc3Npb24gPSAoKSA9PiB1c2VDb250ZXh0KFNlc3Npb25Db250ZXh0KTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwic3VwYWJhc2UiLCJTZXNzaW9uQ29udGV4dCIsInNlc3Npb24iLCJTZXNzaW9uUHJvdmlkZXIiLCJjaGlsZHJlbiIsInNldFNlc3Npb24iLCJhdXRoIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJkYXRhIiwic3Vic2NyaXB0aW9uIiwib25BdXRoU3RhdGVDaGFuZ2UiLCJfZXZlbnQiLCJ1bnN1YnNjcmliZSIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VTZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/lib/SessionContext.tsx\n");

/***/ }),

/***/ "./src/lib/supabaseClient.ts":
/*!***********************************!*\
  !*** ./src/lib/supabaseClient.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabaseUrl = \"https://czckpibltdhompsbllau.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Y2twaWJsdGRob21wc2JsbGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MTIyNTEsImV4cCI6MjA2NTE4ODI1MX0.OQWDbQ_mO00VRFHCiEwGfr_Opshrd5o5GHfXIJqCwcQ\";\nif (!supabaseUrl || !supabaseAnonKey) {\n    throw new Error(\"Missing Supabase URL or anonymous key\");\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL3N1cGFiYXNlQ2xpZW50LnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFxRDtBQUVyRCxNQUFNQyxjQUFjQywwQ0FBb0M7QUFDeEQsTUFBTUcsa0JBQWtCSCxrTkFBeUM7QUFFakUsSUFBSSxDQUFDRCxlQUFlLENBQUNJLGlCQUFpQjtJQUNwQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFTyxNQUFNQyxXQUFXUixtRUFBWUEsQ0FBQ0MsYUFBYUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGRhbGUvd2ViLy4vc3JjL2xpYi9zdXBhYmFzZUNsaWVudC50cz9mOWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcblxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBTdXBhYmFzZSBVUkwgb3IgYW5vbnltb3VzIGtleScpO1xufVxuXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlQW5vbktleSk7XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VBbm9uS2V5IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJFcnJvciIsInN1cGFiYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/lib/supabaseClient.ts\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_SessionContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/SessionContext */ \"./src/lib/SessionContext.tsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_SessionContext__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/home/anarculture/code/anarculture/dale.2/apps/web/src/pages/_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/anarculture/code/anarculture/dale.2/apps/web/src/pages/_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4QjtBQUUwQjtBQUV6QyxTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFLDhEQUFDSCxnRUFBZUE7a0JBQ2QsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZGFsZS93ZWIvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ0Avc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgeyBTZXNzaW9uUHJvdmlkZXIgfSBmcm9tICcuLi9saWIvU2Vzc2lvbkNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxTZXNzaW9uUHJvdmlkZXI+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9TZXNzaW9uUHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiU2Vzc2lvblByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();