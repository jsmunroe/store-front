import { useNavigate as useNavigateRR } from "react-router";

export default function useNavigate() {
    const navigate = useNavigateRR();

    const urls = {
        welcomeUrl: () => '/',
        viewEditor: (viewId) => url('view', viewId),
    };

    return {
        back: () => navigate(-1),
        toWelcome: (state) => navigate(urls.welcomeUrl(), {state}),
        toViewEditor: (viewId, state) => navigate(urls.viewEditor(viewId), {state}),

        ...urls,
    }
}

function url(...parts) {
    let url = '';

    for (const part of parts) {
        if (part === null || typeof(part) === 'undefined') {
            return url;
        }

        url += `/${part}`;
    }

    return url;
}