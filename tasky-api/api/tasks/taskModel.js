import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title:  String,
  description:  String ,
  deadline: Date,
    done: Boolean,
    priority: {type: String, enum: ["Low","Medium","High"]},
    created_at: Date,
    updated_at: Date
});

export default mongoose.model('Task', TaskSchema);
