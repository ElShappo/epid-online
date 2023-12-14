import { message } from "antd";
import { CSSProperties, useEffect } from "react";

type MessageWrapperProps = {
  setValue: any;
  delay?: number;
  fetchAddress: string;
  loadingMessageContent: string;
  errorMessageContent: string;
  style?: CSSProperties;
};

// the purpose of this component is to provide loading animation while fetching any data
export default function MessageWrapper(props: MessageWrapperProps) {
  useEffect(() => {
    async function fetchWithLoading() {
      const loadingMessageKey = "loadingMessage";
      const errorMessageKey = "errorMessage";

      // antd library doesn't supply message component with a delay
      // so I implemented my own version
      // the drawback is that there might be a situation where fetching subjects
      // succeeds before the delay expires - in that case user will have to wait that additional time
      // with that said to improve UX DO NOT SET delay over 1s
      const loadingMessagePromise = new Promise((resolve) => {
        setTimeout(() => {
          message.loading({
            content: props.loadingMessageContent,
            duration: 0,
            key: loadingMessageKey,
            style: props.style,
          });
          resolve(undefined);
        }, props.delay);
      });

      try {
        // extract only first promise which by the way already contains json with subjects
        // the 2nd promise doesn't return anything useful and is only used to show loadingMessage after the delay expires
        const [json] = await Promise.all([
          (await fetch(props.fetchAddress)).json(),
          loadingMessagePromise,
        ]);
        props.setValue(json);
      } catch (error) {
        message.error({
          content: props.errorMessageContent,
          key: errorMessageKey,
          style: props.style,
        });
        console.error(props.errorMessageContent);
      } finally {
        message.destroy(loadingMessageKey);
      }
    }
    fetchWithLoading();
  }, [props]);

  return null;
}
