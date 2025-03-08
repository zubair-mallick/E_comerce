
import ContentLoader from "react-content-loader"
const Loading = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  )
}

export default Loading


;
export const SkeletonCard = () => {
  return (
   <>
   <ContentLoader 
  speed={1}
  backgroundColor="#d9d9d98f"
  foregroundColor="#ecebeb"
>

  {/* Main card background */}
  <rect x="0%" y="0%" rx="6" ry="6" width="100%" height="50%" fill="#212121" />

  {/* Header rectangle */}
  <rect x="8%" y="5%" rx="6" ry="6" width="84%" height="15%" fillOpacity="0.1" />

  {/* SVG path icon (as a placeholder in ContentLoader format) */}
  <path 
    // d="M 57.63% 30.2% V 21.1% a 2.04 2.04 0 0 -2.035 -2.035 H 44.1% a 2.04 2.04 0 0 -2.035 2.035 v 9.1% a 2.04 2.04 0 2.035 2.035 h 13.53% a 2.04 2.04 0 2.035 -2.035 z m -10.9% -3.6% l 2.18% 2.5% L 52.1% 25.6% l 3.9% 5.1% H 44.1% l 3.04% -3.8% z"
    fill="#ecebeb"
    opacity="0.2"
  />

  {/* Text lines */}
  <rect x="8%" y="60%" rx="3" ry="3" width="30%" height="3%" />
  <rect x="45%" y="60%" rx="3" ry="3" width="14%" height="3%" />
  <rect x="62%" y="60%" rx="3" ry="3" width="10%" height="3%" />

  {/* Secondary details */}
  <rect x="8%" y="70%" rx="2" ry="2" width="13%" height="2%" />
  <rect x="28%" y="70%" rx="2" ry="2" width="36%" height="2%" />
  <rect x="68%" y="70%" rx="2" ry="2" width="24%" height="2%" />

  {/* Additional rows */}
  <rect x="8%" y="75%" rx="2" ry="2" width="23%" height="2%" />
  <rect x="36%" y="75%" rx="2" ry="2" width="27%" height="2%" />
  <rect x="70%" y="75%" rx="2" ry="2" width="23%" height="2%" />

  {/* Circle and small rect for icon */}
  <circle cx="12.5%" cy="90%" r="4%" />
  <rect x="22%" y="89%" rx="2" ry="2" width="22%" height="1.5%" />
</ContentLoader>



   </>
  );
};

interface SkeletonProps {
  width?: string;
  length?: number;
  height?: string;
  containerHeight?: string;
}

export const Skeleton = ({
  width = "unset",
  length = 3,
  height = "30px",
  containerHeight = "unset",
}: SkeletonProps) => {
  const skeletions = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skeleton-shape" style={{ height }}></div>
  ));

  return (
    <div className="skeleton-loader" style={{ width, height: containerHeight }}>
      {skeletions}
    </div>
  );
};


