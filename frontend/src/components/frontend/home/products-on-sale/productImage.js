export const getProductImage = (
    product
) => {
    const media =
        Array.isArray(
            product?.media
        )
            ? product.media
            : [];

    const cover =
        media.find(
            (item) =>
                item?.is_cover
        ) || media[0];

    if (!cover) {
        return null;
    }

    if (cover.url) {
        return cover.url;
    }

    if (
        cover.external_url
    ) {
        return cover.external_url;
    }

    const path =
        cover.file_path;

    if (!path) {
        return null;
    }

    if (
        path.startsWith(
            "http://"
        ) ||
        path.startsWith(
            "https://"
        )
    ) {
        return path;
    }

    return `http://127.0.0.1:8000/${path.replace(
        /^\/+/,
        ""
    )}`;
};