import React, { useState } from 'react'
import {lazy} from "@loadable/component";

const asyncLoad = (importComponent) => {
    return lazy(importComponent);
}

export default asyncLoad;
