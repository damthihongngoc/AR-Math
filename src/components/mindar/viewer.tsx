import 'aframe'
import 'mind-ar/dist/mindar-image-aframe.prod.js'
import { useNavigate } from 'react-router'
import AppError from 'src/components/AppError'
import AppLoading from 'src/components/AppLoading'
import useARSystem from 'src/hooks/useARSystem'

type MindARViewerProps = {
  sceneRef: React.RefObject<any>
}
;(window as any).AFRAME.registerComponent('set-render-order', {
  schema: { order: { default: 0 } },

  init: function () {
    this.el.addEventListener('model-loaded', () => {
      const mesh = this.el.getObject3D('mesh')
      if (mesh) {
        mesh.traverse((node: any) => {
          if (node.isMesh) {
            node.renderOrder = this.data.order
            node.material.depthTest = true
            node.material.depthWrite = true
          }
        })
      }
    })
  },
})

const MindARViewer = ({ sceneRef }: MindARViewerProps) => {
  const navigate = useNavigate()
  const { isLoading, loadingError } = useARSystem(sceneRef)

  return (
    <>
      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: targets.mind; autoStart: false; maxTrack: 3; uiError: no; uiLoading: no; uiScanning: no; filterMinCF: 0.1; filterBeta: 10;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets>
          <a-asset-item id="zeroModel" src="3d-models/zero.glb"></a-asset-item>
          <a-asset-item id="oneModel" src="3d-models/one.glb"></a-asset-item>
          <a-asset-item id="twoModel" src="3d-models/two.glb"></a-asset-item>
          <a-asset-item
            id="threeModel"
            src="3d-models/three.glb"
          ></a-asset-item>
          <a-asset-item id="fourModel" src="3d-models/four.glb"></a-asset-item>
          <a-asset-item id="fiveModel" src="3d-models/five.glb"></a-asset-item>
          <a-asset-item id="sixModel" src="3d-models/six.glb"></a-asset-item>
          <a-asset-item
            id="sevenModel"
            src="3d-models/seven.glb"
          ></a-asset-item>
          <a-asset-item
            id="eightModel"
            src="3d-models/eight.glb"
          ></a-asset-item>
          <a-asset-item id="nineModel" src="3d-models/nine.glb"></a-asset-item>
          <a-asset-item id="plusModel" src="3d-models/plus.glb"></a-asset-item>
          <a-asset-item
            id="minusModel"
            src="3d-models/minus.glb"
          ></a-asset-item>
          <a-asset-item
            id="multiplyModel"
            src="3d-models/multiply.glb"
          ></a-asset-item>
          <a-asset-item
            id="divideModel"
            src="3d-models/divide.glb"
          ></a-asset-item>
          <a-asset-item
            id="equalModel"
            src="3d-models/equal.glb"
          ></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Number targets (0-9) */}
        <a-entity id="anchor0" mindar-image-target="targetIndex: 0">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#zeroModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor1" mindar-image-target="targetIndex: 1">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#oneModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor2" mindar-image-target="targetIndex: 2">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#twoModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor3" mindar-image-target="targetIndex: 3">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#threeModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor4" mindar-image-target="targetIndex: 4">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.045 0.045 0.045"
            src="#fourModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor5" mindar-image-target="targetIndex: 5">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#fiveModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor6" mindar-image-target="targetIndex: 6">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#sixModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor7" mindar-image-target="targetIndex: 7">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#sevenModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor8" mindar-image-target="targetIndex: 8">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#eightModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor9" mindar-image-target="targetIndex: 9">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#nineModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        {/* Operator targets */}
        <a-entity id="anchor10" mindar-image-target="targetIndex: 10">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#plusModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor11" mindar-image-target="targetIndex: 11">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#minusModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor12" mindar-image-target="targetIndex: 12">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.04 0.04 0.04"
            src="#multiplyModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="anchor13" mindar-image-target="targetIndex: 13">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.05 0.05 0.05"
            src="#divideModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        {/* Virtual result display entities */}
        <a-entity id="virtual-equal" visible="false">
          <a-gltf-model
            rotation="90 0 0"
            scale="0.04 0.04 0.04"
            src="#equalModel"
            set-render-order="order: 999"
          ></a-gltf-model>
        </a-entity>

        <a-entity id="virtual-result" visible="false">
          {/* Models will be added dynamically */}
        </a-entity>

        <a-entity id="multi-digit-container">
          {/* Models will be added dynamically */}
        </a-entity>
      </a-scene>

      {/* Loading Overlay */}
      {isLoading && <AppLoading message="Đang khởi động AR..." />}

      {/* Error Overlay */}
      {loadingError && (
        <AppError
          title="Lỗi khởi động AR"
          message={loadingError}
          variant="error"
          primaryAction={{
            label: 'Quay lại trang chủ',
            onClick: () => navigate('/'),
          }}
          secondaryAction={{
            label: 'Thử lại',
            onClick: () => window.location.reload(),
          }}
        />
      )}
    </>
  )
}

export default MindARViewer
