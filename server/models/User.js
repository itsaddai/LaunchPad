const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
// may need to change in future installments...

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: false, 
  },
  fullName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
  },
  provider: {
    type: String,
    default: "local",
  }
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;
