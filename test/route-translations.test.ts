import { describe, expect, it } from "vitest";
import { getRouteTranslations } from "@utils/route-translations";

describe("getRouteTranslations", () => {
  it("loads the requested locale and interpolates placeholders", async () => {
    const t = await getRouteTranslations("es", "App.NewsPlaceRss");

    expect(t("title", { place: "Barcelona" })).toBe(
      "Noticias Barcelona - Esdeveniments.cat",
    );
  });

  it("supports the route namespaces used outside the App Directory", async () => {
    const t = await getRouteTranslations("en", "App.PlacesNearby");

    expect(t("invalidRange").toLowerCase()).toContain("coordinates");
    expect(t("invalidRange")).toContain("[-90,90]");
  });

  it("returns the fully qualified key when a message is missing", async () => {
    const t = await getRouteTranslations("ca", "App.NewsRss");

    expect(t("missingKey")).toBe("App.NewsRss.missingKey");
  });
});
