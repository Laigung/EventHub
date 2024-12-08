import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("event/:eventId", "routes/EventDetailPage.tsx"),
    route("create", "routes/CreateEventPage.tsx")
] satisfies RouteConfig;
