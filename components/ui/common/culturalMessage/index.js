import Link from "next/link";
import { getTownValueByLabel } from "@utils/helpers";
import { sendGoogleEvent } from "@utils/analytics";

const CulturalMessage = ({ location }) => {
  const town = getTownValueByLabel(location);

  if (!town) {
    return null;
  }

  const handleNavigation = (town, timeframe) => {
    const eventLabel = `navigate_to_${town}_${timeframe}`;
    sendGoogleEvent(eventLabel);
  };

  return (
    <p className="mt-2">
      Imagina un lloc on cada dia és una nova descoberta. Això és{" "}
      <span className="font-bold">{location}</span>: un univers de cultura
      esperant ser explorat per tu. Comença la teva aventura{" "}
      <Link
        href={`/${town}/avui`}
        onClick={() => handleNavigation(town, "avui")}
        className="font-medium text-primary hover:underline"
      >
        avui
      </Link>
      , descobreix què està passant{" "}
      <Link
        href={`/${town}/dema`}
        onClick={() => handleNavigation(town, "dema")}
        className="font-medium text-primary hover:underline"
      >
        demà
      </Link>
      , continua explorant{" "}
      <Link
        href={`/${town}/setmana`}
        onClick={() => handleNavigation(town, "setmana")}
        className="font-medium text-primary hover:underline"
      >
        durant la setmana
      </Link>
      , i culmina amb un{" "}
      <Link
        href={`/${town}/cap-de-setmana`}
        onClick={() => handleNavigation(town, "cap-de-setmana")}
        className="font-medium text-primary hover:underline"
      >
        cap de setmana espectacular
      </Link>
      . Deixa&apos;t sorprendre per tot el que{" "}
      <span className="font-bold">{location}</span> pot oferir-te.
    </p>
  );
};

export default CulturalMessage;
