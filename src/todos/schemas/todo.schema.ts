import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { TodoStatusEnum } from "../enum/todo-status.enum";

export type TodoDocument = HydratedDocument<Todo>;
@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })
  
export class Todo {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @Prop({
      unique: true,
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    })
    id: ObjectId;

    @ApiProperty({ example: 'Learn English' })
    @Prop({ required: true })
    title: string;

    @ApiProperty({ example: 'read words and grammer' })
    @Prop({ required: false})
    desc: string;

    @ApiProperty({ enum: TodoStatusEnum})
    @Prop({type: String, enum:TodoStatusEnum, default: TodoStatusEnum.TODO})
    status:TodoStatusEnum;

    @ApiProperty({example:'2021-09-01T00:00:00.000Z' })
    @Prop({default: Date.now()})
    startDate:Date;

    @ApiProperty({example:'2021-09-01T00:00:00.000Z' })
    @Prop({default: Date.now(), required: true})
    endDate: Date;

    @ApiProperty({example:'2021-09-01T00:00:00.000Z' })
    @Prop({default: Date.now(), required: false})
    updateAt: Date;

    @ApiProperty({example:'2021-09-01T00:00:00.000Z' })
    @Prop({default: Date.now(), required: false})
    createAt: Date

    @ApiProperty({example:['123e4567-e89b-12d3-a456-426614174000'] })
    @Prop({type: [Types.ObjectId], ref: 'User', required: false})
    assignedTo: ObjectId[]
}
 export const TodoSchema = SchemaFactory.createForClass(Todo);
