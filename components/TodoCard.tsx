"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/boardStore";
import { Todo, TypedColumn } from "@/types";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { DiscoveryModule } from "@nestjs/core";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps
} from "react-beautiful-dnd";

interface Props {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

const TodoCard: FC<Props> = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps
}) => {
  const [deleteTask] = useBoardStore((state) => [state.deleteTask]);
  const [imageUrl, setImageUrl] = useState<string | null>();

  const fetchImage = async () => {
    const url = await getUrl(todo.image!);
    if (url) {
      setImageUrl(url.toString());
    }
  };
  useEffect(() => {
    if (todo.image) {
      fetchImage();
    }
  }, [todo]);

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="bg-white rounded-md drop-shadow-md my-2"
    >
      <div className="flex justify-between items-center p-2">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task Management"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
