import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { messageResponse } from "../types/api-types";

type ResType =
  | {
      data: messageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);
    if (navigate) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const messageResponse = error.data as messageResponse;
    toast.error(messageResponse.message);
  }
};