import Link from "next/link";
import { getTownValueByLabel } from "@utils/helpers";

const CulturalMessage = ({ location }) => {
  const town = getTownValueByLabel(location);

  return (
    <p className="mt-2">
      Imagina un lloc on cada dia és una nova descoberta. Això és{" "}
      <span className="font-bold">{location}</span>: un univers de cultura
      esperant ser explorat per tu. Comença la teva aventura{" "}
      <Link href={`/${town}/avui`}>
        <span className="font-medium text-primary hover:underline">avui</span>
      </Link>
      , descobreix què està passant{" "}
      <Link href={`/${town}/dema`}>
        <span className="font-medium text-primary hover:underline">demà</span>
      </Link>
      , continua explorant{" "}
      <Link href={`/${town}/setmana`}>
        <span className="font-medium text-primary hover:underline">
          durant la setmana
        </span>
      </Link>
      , i culmina amb un{" "}
      <Link href={`/${town}/cap-de-setmana`}>
        <span className="font-medium text-primary hover:underline">
          cap de setmana espectacular
        </span>
      </Link>
      . Deixa&apos;t sorprendre per tot el que{" "}
      <span className="font-bold">{location}</span> pot oferir-te.
    </p>
  );
};

export default CulturalMessage;
