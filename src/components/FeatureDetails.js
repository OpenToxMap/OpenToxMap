import React from 'react';

export default function FeatureDetails({feature}) {
  const {properties} = feature;
  return (
    <div className="feature-details">
      <h2>Name</h2>
      <p>{properties.PRIMARY_NAME}</p>
      <h2>Address</h2>
      <p>{properties.CITY_NAME}</p>
      <p>{properties.COUNTY_NAME}</p>
      <p>{properties.STATE_CODE}</p>
      <p>{properties.POSTAL_CODE}</p>
      <h2>FAC</h2>
      <p>
        <a target="_blank" href={properties.FAC_URL}>
          {properties.FAC_URL}
        </a>
      </p>
      <h2>Status</h2>
      <p>{properties.ACTIVE_STATUS}</p>
    </div>
  );
}
