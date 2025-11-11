import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  Box,
} from '@mui/material';

/**
 * A skeleton loader component that mimics the structure of a Post.
 * This is shown on the initial feed load for a better UX.
 */
const PostSkeleton = () => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="40%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="20%" />}
      />
      <CardContent>
        <Skeleton animation="wave" variant="rectangular" height={200} />
        <Box sx={{ pt: 1 }}>
          <Skeleton />
          <Skeleton width="80%" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostSkeleton;