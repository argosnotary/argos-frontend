/*
 * Copyright (C) 2020 Argos Notary
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";

import {serialize} from "./LinkSigningService";

it("test serialize", () => {
    const seralized = serialize({
        runId: "69af2dd",
        layoutSegmentName: "segment1",
        materials: [
            {
                uri: "src/test/java/com/argosnotary/argos/test/ArgosServiceTestIT.java",
                hash: "61a0af2b177f02a14bab478e68d4907cda4dc3f642ade0432da8350ca199302b"
            }
        ],
        stepName: "build",
        products: [
            {
                uri: "src/test/java/com/argosnotary/argos/test/ArgosServiceTestIT.java",
                hash: "61a0af2b177f02a14bab478e68d4907cda4dc3f642ade0432da8350ca199302b"
            }
        ]
    });

    expect(seralized).toMatchSnapshot();
});
