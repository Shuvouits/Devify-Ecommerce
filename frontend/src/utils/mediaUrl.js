import {
    BACKEND_URL,
} from "../config/app";

export const getMediaUrl = (
    value
) => {
    if (!value) {
        return null;
    }

    const path =
        String(value).trim();

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:") ||
        path.startsWith("blob:")
    ) {
        return path;
    }

    return `${BACKEND_URL}/${path.replace(
        /^\/+/,
        ""
    )}`;
};

export const getMediaSource = (
    media
) => {
    if (!media) {
        return null;
    }

    return getMediaUrl(
        media?.url ||
        media?.external_url ||
        media?.file_path
    );
};