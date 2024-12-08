import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("event/:eventId", "routes/EventDetailPage.tsx")
] satisfies RouteConfig;
