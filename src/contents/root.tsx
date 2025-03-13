import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Content from "~/components/Content";
import type { PlasmoCSConfig } from "plasmo";
import React from "react";

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/messaging/*"]
};

const styleElement = document.createElement("style");

const styleCache = createCache({
    key: "plasmo-mui-cache",
    prepend: true,
    container: styleElement
});

export const getStyle = () => styleElement;

const Root = () => {
    return (
        <CacheProvider value={styleCache}>
            <Content />
        </CacheProvider>
    );
};

export default Root;
