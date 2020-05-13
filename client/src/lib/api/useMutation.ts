import { useState } from "react";
import { server } from "./server";

// state interface descriptive of state obj shape to maintain
interface State<TData> {
    data: TData | null;
    loading: boolean;
    error: boolean;
}

