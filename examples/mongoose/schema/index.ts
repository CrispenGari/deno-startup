import { model, Schema } from "npm:mongoose@^6.7";

const ToSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// valiations
ToSchema.path("title").required(true, "todo title cannot be blank.");

export const Todo = model("todo", ToSchema);
