"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var userSchema = new _mongoose.default.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  user_id: {
    type: Number
  },
  socialKakao: {
    type: Boolean,
    default: false
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  image_url: {
    type: String
  }
});
userSchema.pre("save", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _bcrypt.default.hash(this.password, 5);

        case 2:
          this.password = _context.sent;

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
})));

var User = _mongoose.default.model("User", userSchema);

var _default = User;
exports.default = _default;