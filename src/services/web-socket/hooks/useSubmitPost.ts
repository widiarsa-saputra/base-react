import { types } from "../lib/socket";
import { AddPost } from "../schema/AddPostSchema";

import useBroadcastEvent
    from "./useBroadcastEvent";

const useSubmitPost = () => {

    const {
        sendEvent,
        loading,
        error,
    } = useBroadcastEvent();

    const submitPost = (
        payload: AddPost
    ) => {
        return sendEvent(
            types.addPost,
            payload
        );
    };

    return {
        onSubmit: submitPost,
        isLoading: loading,
        setError: error,
    };
};

export default useSubmitPost;