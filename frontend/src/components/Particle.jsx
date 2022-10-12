import React from 'react';
import MouseParticles from 'react-mouse-particles';

const Particle = () => {

  return (
      <>
        <MouseParticles g={1} radius={20}
          num={0.5}
                    v={1}
  
          color={[
"#3a8fd9",
"#6610f2",
"#686dc3",
"#e83283",
"#fc346f",
"#fd7e14",
"#ffc107",
"#41d7a7",
"#528fb3",
"#39cbfb",
"#fff"
          ]} cull="col,image-wrapper"/>
      </>
    )
  }

export default Particle