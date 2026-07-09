import mongoose from "mongoose";

mongoose.plugin((schema) => {
    schema.set("toJSON", {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;

            return ret;
        },
    });
});

const connectDb = (URI) => {
    return mongoose.connect(URI);
};

export { connectDb };
