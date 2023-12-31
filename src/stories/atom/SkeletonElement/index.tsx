import React, { PropsWithChildren } from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';
import './style.css';

export interface SkeletonElementProps extends SkeletonProps {
  isLoading?: boolean | undefined;
  containerClassName?: string;
}

export const SkeletonElement = (props: PropsWithChildren<SkeletonElementProps>) => {
  const { isLoading, children, containerClassName, ...skeletonProps } = props;
  return (
    <>
      {isLoading ? (
        <Skeleton
          {...skeletonProps}
          containerClassName={`leading-none z-0 ${containerClassName}`}
        ></Skeleton>
      ) : (
        children
      )}
    </>
  );
};

// export const SkeletonCircle = (props: PropsWithChildren<SkeletonElementProps>) => {
//   const { isLoading, children, ...skeletonProps } = props;
//   return (
//     <>
//       {isLoading ? (
//         <>
//           <Skeleton {...skeletonProps} circle></Skeleton>
//           <Skeleton {...skeletonProps}></Skeleton>{' '}
//         </>
//       ) : (
//         children
//       )}
//     </>
//   );
// };
