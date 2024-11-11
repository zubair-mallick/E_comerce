import React from "react";
// import "./ProductTableSkeleton.scss";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div aria-live="polite" aria-busy="true" className={`skeleton ${className}`}>
    <span className="skeleton__pulse"></span>
    <br />
  </div>
);

const SVGSkeleton: React.FC<SkeletonProps> = ({ className }) => (
  <svg className={`skeleton-svg ${className} animate-pulse`}></svg>
);

const ProductTableSkeleton: React.FC = () => (
  <div className="product-table-skeleton">
    <table>
      <thead>
        <tr>
          <th><Skeleton className="skeleton--th" /></th>
          <th><Skeleton className="skeleton--th" /></th>
          <th><Skeleton className="skeleton--th" /></th>
          <th><Skeleton className="skeleton--th" /></th>
          <th><Skeleton className="skeleton--th" /></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 20 }).map((_, index) => (
          <tr key={index}>
            <td><SVGSkeleton className="skeleton-svg--icon" /></td>
            <td><Skeleton className="skeleton--td-large" /></td>
            <td><Skeleton className="skeleton--td-medium" /></td>
            <td><Skeleton className="skeleton--td-small" /></td>
            <td><Skeleton className="skeleton--action" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTableSkeleton;
